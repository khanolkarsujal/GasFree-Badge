// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title GasFreeBadge
 * @notice UGF-native gasless NFT badge minter for Base Sepolia.
 *         Users claim badges via UGF — zero ETH required in their wallet.
 *
 * @dev UGF Integration:
 *      - UGF relayer calls claimBadge(recipient, badgeType) on behalf of the user
 *      - The recipient address (user's wallet) is encoded in the calldata
 *      - The NFT is minted directly to the user
 *      - No per-wallet restrictions — UGF handles spam prevention via Mock USD cost
 */
contract GasFreeBadge is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // ─── Collection config ────────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY = 10_000;

    // ─── State ────────────────────────────────────────────────────────────────
    uint256 private _nextTokenId;
    string  private _baseTokenURI;
    bool    public  paused;

    // Token ID -> Badge Type (0 = Explorer, 1 = Builder, 2 = Pioneer)
    mapping(uint256 => uint8) public tokenBadgeType;

    // ─── Events ───────────────────────────────────────────────────────────────
    event BadgeClaimed(address indexed recipient, uint256 indexed tokenId, uint8 indexed badgeType);
    event Paused(bool status);

    // ─── Errors ───────────────────────────────────────────────────────────────
    error MaxSupplyReached();
    error ZeroAddress();
    error ContractPaused();
    error InvalidBadgeType();

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(
        address initialOwner,
        string memory baseTokenURI
    )
        ERC721("GasFreeBadge", "GFB")
        Ownable(initialOwner)
    {
        _baseTokenURI = baseTokenURI;
    }

    // ─── Core Gasless Claim (UGF-native) ─────────────────────────────────────
    /**
     * @notice Mint a badge to `recipient` with a specific `badgeType`.
     * @dev    Called by UGF relayer on behalf of the user.
     *         The recipient address is the actual user wallet.
     *         No per-wallet limit — UGF's Mock USD cost prevents spam.
     * @param  recipient  The wallet that receives the NFT.
     * @param  badgeType  The type of badge (0 = Explorer, 1 = Builder, 2 = Pioneer).
     * @return tokenId    The minted token ID.
     */
    function claimBadge(address recipient, uint8 badgeType)
        external
        nonReentrant
        returns (uint256)
    {
        if (paused)                          revert ContractPaused();
        if (recipient == address(0))         revert ZeroAddress();
        if (badgeType > 2)                   revert InvalidBadgeType();
        if (_nextTokenId >= MAX_SUPPLY)      revert MaxSupplyReached();

        uint256 tokenId = _nextTokenId++;
        tokenBadgeType[tokenId] = badgeType;
        _safeMint(recipient, tokenId);
        emit BadgeClaimed(recipient, tokenId, badgeType);
        return tokenId;
    }

    // ─── View helpers ─────────────────────────────────────────────────────────
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }

    // Returns the badge type of a token
    function getBadgeType(uint256 tokenId) external view returns (uint8) {
        _requireOwned(tokenId);
        return tokenBadgeType[tokenId];
    }

    function remaining() external view returns (uint256) {
        return MAX_SUPPLY - _nextTokenId;
    }

    // ─── Owner controls ───────────────────────────────────────────────────────
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit Paused(_paused);
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    // ─── Overrides ────────────────────────────────────────────────────────────
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId)
        public view override returns (string memory)
    {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        return bytes(base).length > 0
            ? string(abi.encodePacked(base, uint256(tokenBadgeType[tokenId]).toString(), ".json"))
            : "";
    }
}
