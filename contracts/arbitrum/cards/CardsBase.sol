// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/token/ERC1155/ERC1155.sol';

contract CardsBase is ERC1155 {
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(tokenId), '.json'));
    }
}
