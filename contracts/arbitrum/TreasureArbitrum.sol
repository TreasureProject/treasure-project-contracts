// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/access/OwnableInternal.sol';
import '@solidstate/contracts/introspection/ERC165.sol';
import '@solidstate/contracts/token/ERC1155/enumerable/ERC1155Enumerable.sol';

import '../Base64.sol';
import './TreasureArbitrumStorage.sol';

contract TreasureArbitrum is ERC1155Enumerable, ERC165, OwnableInternal {
    function uri(uint256 tokenId) public view returns (string memory) {
        string[3] memory parts;
        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = TreasureArbitrumStorage.layout().itemNames[tokenId];

        parts[2] = '</text></svg>';

        string memory output = string(
            abi.encodePacked(parts[0], parts[1], parts[2])
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        TreasureArbitrumStorage.layout().itemNames[tokenId],
                        '", "description": "TODO", "image": "data:image/svg+xml;base64,',
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

    function mint(
        address account,
        string memory name,
        uint256 amount
    ) external onlyOwner {
        uint256 id = uint256(keccak256(abi.encodePacked(name)));
        TreasureArbitrumStorage.layout().itemNames[id] = name;
        _mint(msg.sender, id, 1, '');
    }
}
