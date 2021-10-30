// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/access/OwnableInternal.sol';
import '@solidstate/contracts/token/ERC1155/metadata/ERC1155MetadataStorage.sol';

contract CardsUpdateMetadata is OwnableInternal {
    function setBaseURI(string memory baseURI) external onlyOwner {
        ERC1155MetadataStorage.layout().baseURI = baseURI;
    }
}
