// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title GasFreeBadge
 * @notice UGF-native gasless NFT badge minter for Base Sepolia.
 *         Users claim badges via UGF — zero ETH required in their wallet.
 *
 * @dev UGF Integration:
 *      - UGF relayer calls claimBadge(recipient) on behalf of the user
 *      - The recipient address (user's wallet) is encoded in the calldata
 *      - The NFT is minted directly to the user
 *      - No per-wallet restrictions — UGF handles spam prevention via Mock USD cost
 */
contract GasFreeBadge is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // ─── Collection config ────────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY = 10_000;

    // ─── State ────────────────────────────────────────────────────────────────
    uint256 private _nextTokenId;
    string  private _baseTokenURI;
    bool    public  paused;

    // ─── Events ───────────────────────────────────────────────────────────────
    event BadgeClaimed(address indexed recipient, uint256 indexed tokenId);
    event Paused(bool status);

    // ─── Errors ───────────────────────────────────────────────────────────────
    error MaxSupplyReached();
    error ZeroAddress();
    error ContractPaused();

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
     * @notice Mint a badge to `recipient`.
     * @dev    Called by UGF relayer on behalf of the user.
     *         The recipient address is the actual user wallet.
     *         No per-wallet limit — UGF's Mock USD cost prevents spam.
     * @param  recipient  The wallet that receives the NFT.
     * @return tokenId    The minted token ID.
     */
    function claimBadge(address recipient)
        external
        nonReentrant
        returns (uint256)
    {
        if (paused)                          revert ContractPaused();
        if (recipient == address(0))         revert ZeroAddress();
        if (_nextTokenId >= MAX_SUPPLY)      revert MaxSupplyReached();

        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        emit BadgeClaimed(recipient, tokenId);
        return tokenId;
    }

    // ─── View helpers ─────────────────────────────────────────────────────────
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
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
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
