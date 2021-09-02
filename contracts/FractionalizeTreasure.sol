pragma solidity ^0.8.0 

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

interface TreasureInterface {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    
    function getAsset1(uint256 tokenId) public view returns (string memory);
    
    function getAsset2(uint256 tokenId) public view returns (string memory);
    
    function getAsset3(uint256 tokenId) public view returns (string memory);
    
    function getAsset4(uint256 tokenId) public view returns (string memory);
    
    function getAsset5(uint256 tokenId) public view returns (string memory);
    
    function getAsset6(uint256 tokenId) public view returns (string memory);
    
    function getAsset7(uint256 tokenId) public view returns (string memory);
    
    function getAsset8(uint256 tokenId) public view returns (string memory);
}

contract FractionalizeTreasure is ERC1155, ReentrancyGuard, Ownable {
    
    address public treasureAddress = 0xf3DFbE887D81C442557f7a59e3a0aEcf5e39F6aa;
    TreasureInterface public treasureContract = TreasureInterface(treasureAddress);
    
    mapping assetToTokenId (string=>uint256);
    
    struct Item {
    string name;
    uint value;
    }

    mapping (uint256 => string) private itemNames;
    mapping (uint256 => uint256) private itemValues;

    constructor (Item[] calldata items) {
    itemNames[uint256(keccak256("Red Feather""Snow White Feather"))] = "Red and White Feather";
    itemValues[uint256(keccak256("Red Feather""Snow White Feather"))] = 100;

    for (uint i; i < items.length; i++) {
        uint tokenId = uint256(keccak256(items.name));
        itemNames[tokenId] = items.name;
        itemValues[tokenId] = items.value;
        }
    }

    
    function decompose(uint256 tokenId) public returns (string[] memory) {
        _mint(msg.sender,uint256(keccak256(getAsset1(itemValues[tokenId]))),1,itemNames[tokenId])
        
        _mint(msg.sender,uint256(keccak256(getAsset2(itemValues[tokenId]))))
    }
}