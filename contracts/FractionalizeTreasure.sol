pragma solidity ^0.8.0 

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

interface IERC721Receiver {
    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721.onERC721Received.selector`.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

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
        _mintBatch(msg.sender,uint256[keccak256(itemNames[getAsset1(tokenId)],keccak256(itemNames[getAsset2(tokenId)]))])
    }
    function fractionalize (uint tokenId) external {
    // TODO: ERC721 transfer of tokenId to address(this)
    safeTransferFrom(msg.sender, this, tokenId)

    _mintBatch(msg.sender, uint256[uint256(keccak256(getAsset1(tokenId))),uint256(keccak256(getAsset2(tokenId))),uint256(keccak256(getAsset3(tokenId))),uint256(keccak256(getAsset4(tokenId))),uint256(keccak256(getAsset5(tokenId))),uint256(keccak256(getAsset6(tokenId))),uint256(keccak256(getAsset7(tokenId))),uint256(keccak256(getAsset8(tokenId))), uint256[1,1,1,1,1,1,1,1]);
    
    }
}