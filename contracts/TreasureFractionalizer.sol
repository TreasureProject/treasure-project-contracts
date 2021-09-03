// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/interfaces/IERC721Receiver.sol';

import './ITreasure.sol';
import './Base64.sol';

contract TreasureFractionalizer is ERC1155 {
    address public immutable TREASURE;

    struct Item {
        string name;
        uint256 value;
    }

    mapping(uint256 => string) private itemNames;
    mapping(uint256 => uint256) private itemValues;

    constructor(address treasure, Item[] memory items) ERC1155('') {
        itemNames[
            uint256(keccak256('Red Feather' 'Snow White Feather'))
        ] = 'Red and White Feather';
        itemValues[
            uint256(keccak256('Red Feather' 'Snow White Feather'))
        ] = 100;

        for (uint256 i; i < items.length; i++) {
            uint256 tokenId = _nameToId(items[i].name);
            itemNames[tokenId] = items[i].name;
            itemValues[tokenId] = items[i].value;
        }

        TREASURE = treasure;
    }

    function fractionalize(uint256 tokenId) public returns (string[] memory) {
        // TODO: ERC721 transfer of tokenId to address(this)
        // safeTransferFrom(msg.sender, this, tokenId);

        uint256[] memory ids = new uint256[](8);
        ids[0] = _nameToId(ITreasure(TREASURE).getAsset1(tokenId));
        ids[1] = _nameToId(ITreasure(TREASURE).getAsset2(tokenId));
        ids[2] = _nameToId(ITreasure(TREASURE).getAsset3(tokenId));
        ids[3] = _nameToId(ITreasure(TREASURE).getAsset4(tokenId));
        ids[4] = _nameToId(ITreasure(TREASURE).getAsset5(tokenId));
        ids[5] = _nameToId(ITreasure(TREASURE).getAsset6(tokenId));
        ids[6] = _nameToId(ITreasure(TREASURE).getAsset7(tokenId));
        ids[7] = _nameToId(ITreasure(TREASURE).getAsset8(tokenId));

        uint256[] memory amounts = new uint256[](8);
        ids[0] = 1;
        ids[1] = 1;
        ids[2] = 1;
        ids[3] = 1;
        ids[4] = 1;
        ids[5] = 1;
        ids[6] = 1;
        ids[7] = 1;

        _mintBatch(msg.sender, ids, amounts, '');
    }

    function _nameToId(string memory name) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(name)));
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        string[3] memory parts;
        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = itemNames[tokenId];

        parts[2] = '</text></svg>';

        string memory output = string(
            abi.encodePacked(parts[0], parts[1], parts[2])
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Treasure #',
                        itemValues[tokenId],
                        '", "description": "Treasures are fractionalized  is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );

        output = string(
            abi.encodePacked('data:application/json;base64,', json)
        );

        return output;
    }
}
