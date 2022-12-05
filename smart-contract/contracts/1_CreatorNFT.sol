// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CreatorNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private _creatorAddress;
    uint256 private _price;
    string private _userReferenceID;
    string private _creatorTokenURI;

    mapping (uint256 => address) private _tokenIDToOwner;

    constructor(address creatorAddress, uint256 price, string memory userReferenceID, string memory tokenName, string memory tokenSymbol, string memory creatorTokenURI) 
    ERC721(tokenName, tokenSymbol)
    Ownable()
    {
        _creatorAddress = creatorAddress;
        _price = price;
        _userReferenceID = userReferenceID;
        _creatorTokenURI = creatorTokenURI;

        // Transfer ownership of the contract to the Content Creator
        _transferOwnership(creatorAddress);
        
    }

    function changePrice (uint256 newPrice) public onlyOwner {
        _price = newPrice;
    }

    function getPrice() public view returns (uint256) {
        return _price;
    }


    function purchaseSubscription() payable public returns (uint256) {
        require(msg.value >= _price, "Insufficient funds");
        require(balanceOf(_msgSender()) <= 0, "Already bought NFT");

        _tokenIds.increment();
        uint256 currentID = _tokenIds.current();


        _safeMint(_msgSender(), currentID);
        _setTokenURI(currentID, _creatorTokenURI);

        address tokenOwner = ownerOf(currentID);

        // Transfer ownership of the NFT to the buyer
        // Transferring first, and then paying Creator to prevent Reentrancy
        _transfer(tokenOwner, _msgSender(), currentID);
        _tokenIDToOwner[currentID] = _msgSender();

        // Make a payment to the owner of the token
        (bool sent, ) = payable(_creatorAddress).call{value: msg.value}("");

        require(sent, "Payment failed");

        return currentID;

    }
}

