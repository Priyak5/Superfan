// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./1_CreatorNFT.sol";

contract DeployCreatorNFT is Ownable {

    event DeployNFT(string indexed symbol, address indexed contractAddress);

    struct CreatorData {
        string userReferenceID;
        string tokenName;
        string tokenSymbol; 
        address contractAddress;
    }

    mapping(string => CreatorData) private _userReferenceIDToCreatorData;
    mapping(string => string) private _tokenSymbolToUserReferenceID;
    mapping(string => CreatorData) private _tokenSymbolToCreatorData;
    mapping(address => CreatorData) private _contractAddressToCreatorData;

    CreatorData [] private _creators;

    function getContractAddressFromSymbol(string memory tokenSymbol) public view returns (address){
        require(bytes(_tokenSymbolToCreatorData[tokenSymbol].tokenSymbol).length > 0, "Token Symbol does not exists");
        return _tokenSymbolToCreatorData[tokenSymbol].contractAddress;
    }

    function getCreatorDataFromContractAddress(address contractAddress) public view returns (CreatorData memory) {
        require(bytes(_contractAddressToCreatorData[contractAddress].userReferenceID).length > 0, "Contract does not exist");
        return _contractAddressToCreatorData[contractAddress];
    }

    function getAllCreators() public view returns (CreatorData[] memory) {
        return _creators;
    }

    function deployNFT (
        address creatorAddress,
        uint256 price,
        string memory userReferenceID,
        string memory tokenName,
        string memory tokenSymbol,
        string memory creatorTokenURI
    ) public onlyOwner returns(address) {
        require(bytes(_tokenSymbolToUserReferenceID[tokenSymbol]).length == 0, "Symbol already exists");
        require(_userReferenceIDToCreatorData[userReferenceID].contractAddress == address(0), "ReferenceID already exists");

        address creatorNFTAddress = address(new CreatorNFT(creatorAddress, price, userReferenceID, tokenName, tokenSymbol, creatorTokenURI));

        _tokenSymbolToUserReferenceID[tokenSymbol] = userReferenceID;

        
        CreatorData memory creatorData = CreatorData(
            userReferenceID,
            tokenName,
            tokenSymbol,
            creatorNFTAddress
        );
        _userReferenceIDToCreatorData[userReferenceID] = creatorData;
        _tokenSymbolToCreatorData[tokenSymbol] = creatorData;
        _contractAddressToCreatorData[creatorNFTAddress] = creatorData;
        _creators.push(creatorData);
    
        emit DeployNFT(tokenSymbol, creatorNFTAddress);
    }


}