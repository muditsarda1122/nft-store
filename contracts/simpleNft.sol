// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNft is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId;
    uint256[] private _allTokenIds;

    mapping(uint256 tokenId => address owner) private _tokenOwners;
    mapping(uint256 tokenId => uint256 price) private _tokenPrices;
    mapping(uint256 tokenId => string name) private _tokenName;
    mapping(uint256 tokenId => address previousOwner) private _tokenPreviousOwners;

    event NFTMinted(address indexed owner, uint256 tokenId, string tokenURI);
    event NFTBurned(uint256 tokenId);
    event NFTTransferred(address indexed from, address indexed to, uint256 tokenId);
    event PaymentMade(address indexed from, address indexed to, uint256 tokenId, uint256 amount);

    constructor() ERC721("SimpleNFT", "SNFT") Ownable(msg.sender){}

    function mint(string memory _tokenURI, string memory _name, uint256 _price) public returns (uint256) {
        require(_price > 0, "Price must be greater than zero");
        
        uint256 newTokenId = _currentTokenId + 1;
        _currentTokenId = newTokenId;

        _tokenOwners[newTokenId] = msg.sender;
        _tokenPrices[newTokenId] = _price;
        _tokenName[newTokenId] = _name;
        _tokenPreviousOwners[newTokenId] = address(0);

        _allTokenIds.push(newTokenId);

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        emit NFTMinted(msg.sender, newTokenId, _tokenURI);
        return newTokenId;
    }

    function buyNFT(uint256 tokenId) public payable {
        address NftOwner = _tokenOwners[tokenId];
        uint256 price = _tokenPrices[tokenId];

        require(NftOwner != address(0), "Token does not exist");
        require(msg.sender != NftOwner, "Cannot buy your own NFT");
        require(msg.value >= price, "Insufficient funds sent");

        payable(NftOwner).transfer(price);

        _transfer(NftOwner, msg.sender, tokenId);

        _tokenOwners[tokenId] = msg.sender;
        _tokenPreviousOwners[tokenId] = NftOwner;

        emit PaymentMade(msg.sender, NftOwner, tokenId, price);
        emit NFTTransferred(NftOwner, msg.sender, tokenId);
    }

    function getMyNFTs() public view returns (uint256[] memory nftsMinted, uint256[] memory nftsBought) {
        uint256[] memory allTokenIds = getAllTokenIds();
        uint256 totalTokens = allTokenIds.length;

        uint256 mintedCount = 0;
        uint256 boughtCount = 0;

        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = _allTokenIds[i];
            if (_tokenOwners[tokenId] == msg.sender) {
                if (_tokenPreviousOwners[tokenId] == address(0)) {
                    mintedCount++;
                } else {
                    boughtCount++;
                }
            }
        }

        uint256[] memory mintedTokens = new uint256[](mintedCount);
        uint256[] memory boughtTokens = new uint256[](boughtCount);
        uint256 mintedIndex = 0;
        uint256 boughtIndex = 0;

        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = _allTokenIds[i];
            if (_tokenOwners[tokenId] == msg.sender) {
                if (_tokenPreviousOwners[tokenId] == address(0)) {
                    mintedTokens[mintedIndex] = tokenId;
                    mintedIndex++;
                } else {
                    boughtTokens[boughtIndex] = tokenId;
                    boughtIndex++;
                }
            }
        }

        return (mintedTokens, boughtTokens);
    }

    // function burn(uint256 tokenId) public {
    //     require(ownerOf(tokenId) == msg.sender, "Only the owner can burn the token");
        
    //     delete _tokenOwners[tokenId];
    //     // delete _tokenPrices[tokenId];
    //     _removeTokenId(tokenId);

    //     _burn(tokenId);

    //     emit NFTBurned(tokenId);
    // }

    // function transfer(address to, uint256 tokenId) public {
    //     require(ownerOf(tokenId) == msg.sender, "Only the owner can transfer the token");
        
    //     _tokenOwners[tokenId] = to;
    //     _transfer(msg.sender, to, tokenId);

    //     emit NFTTransferred(msg.sender, to, tokenId);
    // }

    function ownerOfToken(uint256 tokenId) public view returns (address) {
        return _tokenOwners[tokenId];
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
    }

    function getName(uint256 tokenId) public view returns (string memory) {
        return _tokenName[tokenId];
    }

    function getAllTokenIds() public view returns (uint256[] memory) {
        return _allTokenIds;
    }

    function totalSupply() public view returns (uint256) {
        return _allTokenIds.length;
    }

    function currentTokenId() public view returns(uint256) {
        return _currentTokenId; 
    }

    // function _removeTokenId(uint256 tokenId) private {
    //     for (uint256 i = 0; i < _allTokenIds.length; i++) {
    //         if (_allTokenIds[i] == tokenId) {
    //             _allTokenIds[i] = _allTokenIds[_allTokenIds.length - 1];
    //             _allTokenIds.pop();
    //             break;
    //         }
    //     }
    // }
}