// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNft is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId;
    mapping(uint256 tokenId => address owner) private _tokenOwners;
    // mapping(uint256 tokenId => uint256 price) private _tokenPrices;
    uint256[] private _allTokenIds;

    event NFTMinted(address indexed owner, uint256 tokenId, string tokenURI);
    event NFTBurned(uint256 tokenId);
    event NFTTransferred(address indexed from, address indexed to, uint256 tokenId);

    constructor() ERC721("SimpleNFT", "SNFT") Ownable(msg.sender){}

    function mint(string memory _tokenURI) public returns (uint256) {
        // require(price > 0, "Price must be greater than zero");
        
        uint256 newTokenId = _currentTokenId + 1;
        _currentTokenId = newTokenId;
        _tokenOwners[newTokenId] = msg.sender;
        // _tokenPrices[newTokenId] = price;
        _allTokenIds.push(newTokenId);

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        emit NFTMinted(msg.sender, newTokenId, _tokenURI);
        return newTokenId;
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

    // function getPrice(uint256 tokenId) public view returns (uint256) {
    //     return _tokenPrices[tokenId];
    // }

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