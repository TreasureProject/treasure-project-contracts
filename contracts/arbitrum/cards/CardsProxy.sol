// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/introspection/ERC165Storage.sol';
import '@solidstate/contracts/proxy/diamond/Diamond.sol';
import '@solidstate/contracts/token/ERC1155/IERC1155.sol';
import '@solidstate/contracts/token/ERC1155/metadata/ERC1155MetadataStorage.sol';

import './CardsMintStorage.sol';

contract CardsProxy is Diamond {
    using ERC165Storage for ERC165Storage.Layout;

    constructor(address merkleProofClaim, string memory baseURI) {
        ERC165Storage.layout().setSupportedInterface(
            type(IERC1155).interfaceId,
            true
        );
        CardsMintStorage.layout().minters[merkleProofClaim] = true;
        ERC1155MetadataStorage.layout().baseURI = baseURI;
    }
}
