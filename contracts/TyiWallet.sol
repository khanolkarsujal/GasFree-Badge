// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TyiWallet
 * @notice Paytm-style custodial wallet on Base Sepolia — instant internal transfers,
 *         collect requests, deposits, and withdrawals in TYI settlement token.
 * @dev    Backend indexes all events for passbook / SaaS APIs. UGF can sponsor
 *         deposit/withdraw/transfer txs for gasless UX.
 */
contract TyiWallet is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable settlementToken;

    uint256 public constant MIN_TRANSFER = 1; // 1 wei minimum
    uint256 public constant MAX_TTL       = 30 days;

    enum PaymentStatus {
        None,
        Pending,
        Fulfilled,
        Cancelled,
        Expired
    }

    struct PaymentRequest {
        address payee;
        uint256 amount;
        uint40  createdAt;
        uint40  expiresAt;
        bytes32 noteHash;
        PaymentStatus status;
    }

    /// @notice In-wallet balance per user (TYI held in contract escrow).
    mapping(address => uint256) public balances;

    mapping(bytes32 => PaymentRequest) public paymentRequests;

    uint256 public totalDeposited;
    uint256 public totalWithdrawn;
    uint256 public totalInternalVolume;

    event Deposited(
        address indexed user,
        uint256 amount,
        uint256 newBalance,
        bytes32 indexed refId
    );
    event Withdrawn(
        address indexed user,
        uint256 amount,
        uint256 newBalance,
        bytes32 indexed refId
    );
    event InternalTransfer(
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes32 indexed refId,
        uint256 fromBalance,
        uint256 toBalance
    );
    event PaymentRequestCreated(
        bytes32 indexed requestId,
        address indexed payee,
        uint256 amount,
        uint40 expiresAt,
        bytes32 noteHash
    );
    event PaymentRequestFulfilled(
        bytes32 indexed requestId,
        address indexed payer,
        address indexed payee,
        uint256 amount
    );
    event PaymentRequestCancelled(bytes32 indexed requestId, address indexed payee);
    event PaymentRequestExpired(bytes32 indexed requestId);

    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance();
    error InvalidRequest();
    error RequestNotPending();
    error RequestExpired();
    error RequestExists();
    error SelfTransfer();
    error InvalidTTL();
    error Unauthorized();

    constructor(address initialOwner, address tyiToken) Ownable(initialOwner) {
        if (tyiToken == address(0)) revert ZeroAddress();
        settlementToken = IERC20(tyiToken);
    }

    // ─── Wallet operations ────────────────────────────────────────────────────

    function deposit(uint256 amount, bytes32 refId) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        settlementToken.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        totalDeposited += amount;
        emit Deposited(msg.sender, amount, balances[msg.sender], refId);
    }

    function withdraw(uint256 amount, bytes32 refId) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();
        balances[msg.sender] -= amount;
        totalWithdrawn += amount;
        settlementToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount, balances[msg.sender], refId);
    }

    /**
     * @notice Instant P2P transfer from in-wallet balance (Paytm send money).
     */
    function transferTo(
        address to,
        uint256 amount,
        bytes32 refId
    ) external nonReentrant {
        if (to == address(0)) revert ZeroAddress();
        if (to == msg.sender) revert SelfTransfer();
        if (amount < MIN_TRANSFER) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        balances[msg.sender] -= amount;
        balances[to] += amount;
        totalInternalVolume += amount;

        emit InternalTransfer(
            msg.sender,
            to,
            amount,
            refId,
            balances[msg.sender],
            balances[to]
        );
    }

    // ─── Collect / request money (Paytm request payment) ──────────────────────

    function createPaymentRequest(
        bytes32 requestId,
        uint256 amount,
        uint40 ttlSeconds,
        bytes32 noteHash
    ) external {
        if (requestId == bytes32(0)) revert InvalidRequest();
        if (amount < MIN_TRANSFER) revert ZeroAmount();
        if (ttlSeconds == 0 || ttlSeconds > MAX_TTL) revert InvalidTTL();

        PaymentRequest storage req = paymentRequests[requestId];
        if (req.status != PaymentStatus.None) revert RequestExists();

        uint40 expiresAt = uint40(block.timestamp) + ttlSeconds;
        req.payee     = msg.sender;
        req.amount    = amount;
        req.createdAt = uint40(block.timestamp);
        req.expiresAt = expiresAt;
        req.noteHash  = noteHash;
        req.status    = PaymentStatus.Pending;

        emit PaymentRequestCreated(requestId, msg.sender, amount, expiresAt, noteHash);
    }

    function payRequest(bytes32 requestId) external nonReentrant {
        PaymentRequest storage req = paymentRequests[requestId];
        if (req.status != PaymentStatus.Pending) revert RequestNotPending();
        if (block.timestamp > req.expiresAt) {
            req.status = PaymentStatus.Expired;
            emit PaymentRequestExpired(requestId);
            revert RequestExpired();
        }
        if (msg.sender == req.payee) revert SelfTransfer();
        if (balances[msg.sender] < req.amount) revert InsufficientBalance();

        uint256 amount = req.amount;
        address payee  = req.payee;

        balances[msg.sender] -= amount;
        balances[payee] += amount;
        req.status = PaymentStatus.Fulfilled;
        totalInternalVolume += amount;

        emit PaymentRequestFulfilled(requestId, msg.sender, payee, amount);
        emit InternalTransfer(
            msg.sender,
            payee,
            amount,
            requestId,
            balances[msg.sender],
            balances[payee]
        );
    }

    function cancelPaymentRequest(bytes32 requestId) external {
        PaymentRequest storage req = paymentRequests[requestId];
        if (req.status != PaymentStatus.Pending) revert RequestNotPending();
        if (msg.sender != req.payee) revert Unauthorized();

        req.status = PaymentStatus.Cancelled;
        emit PaymentRequestCancelled(requestId, req.payee);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    function getPaymentRequest(bytes32 requestId)
        external
        view
        returns (
            address payee,
            uint256 amount,
            uint40 createdAt,
            uint40 expiresAt,
            bytes32 noteHash,
            PaymentStatus status
        )
    {
        PaymentRequest storage req = paymentRequests[requestId];
        return (
            req.payee,
            req.amount,
            req.createdAt,
            req.expiresAt,
            req.noteHash,
            req.status
        );
    }

    function walletStats()
        external
        view
        returns (uint256 deposited, uint256 withdrawn, uint256 internalVolume)
    {
        return (totalDeposited, totalWithdrawn, totalInternalVolume);
    }
}
