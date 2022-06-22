// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract FunderMarket is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;

    uint256 listingPrice = 1 ether;
    address payable owner;
    address internal admin;

    mapping(uint256 => Project) private projects;

    struct Project {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool resale;
    }

    event ProjectMarketCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("Animals On Trial Fund", "AOTF") {
        owner = payable(msg.sender);
        admin = msg.sender;
    }

    function updateListingPrice(uint _listingPrice) public payable {
        require(owner == msg.sender, "Only marketplace owner can update listing price.");
        listingPrice = _listingPrice;
    }

    function getNftOwner(uint index) public view returns (address) {
        return projects[index].owner;
    }

    function getContractOwner()public view returns (address){
        return owner;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function getAdmin()public view returns (address){
        return admin;
    }

    function createProject(string memory tokenURI, uint256 price) public payable returns (uint) {
        tokenId.increment();
        uint256 newTokenId = tokenId.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createProjectMarket(newTokenId, price);
        return newTokenId;
    }

    function createProjectMarket(
        uint256 _tokenId,
        uint256 price
    ) private {
        require(price > 0, "Price must be at least 1 wei");

        projects[_tokenId] =  Project(
            _tokenId,
            payable(msg.sender),
            payable(msg.sender),
            price,
            false,
            false
        );

        emit ProjectMarketCreated(
            _tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function pushProjectToMarketPlace(uint256 _tokenId) public payable {
        require(projects[_tokenId].owner == msg.sender, "Only item owner can perform this operation");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _transfer(msg.sender, owner, _tokenId);

        projects[_tokenId].sold = false;
        projects[_tokenId].seller = payable(msg.sender);
        projects[_tokenId].owner = owner;
        projects[_tokenId].resale = true;

        
    }


    function fundProject(
        uint256 _tokenId
    ) public payable {
        uint price = projects[_tokenId].price;
        address seller = projects[_tokenId].seller;
        require(msg.value >= price, "Please submit the asking price in order to complete the purchase");
        _transfer(projects[_tokenId].owner, msg.sender, _tokenId);
        projects[_tokenId].owner = payable(msg.sender);
        projects[_tokenId].sold = true;
        projects[_tokenId].seller = payable(address(0));
        
        
        if(projects[_tokenId].resale){
            payable(owner).transfer(listingPrice);
        }
        payable(seller).transfer(msg.value);
    }

    function getProject(uint256 _tokenId) public view returns (Project memory) {
        return projects[_tokenId];
    }

    function getProjectsLength() public view returns (uint256) {
        return tokenId.current();
    }

}
