// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/proxy/diamond/Diamond.sol';
import { IERC1155 } from '@solidstate/contracts/token/ERC1155/IERC1155.sol';
import { IERC165 } from '@solidstate/contracts/introspection/IERC165.sol';

contract TreasureArbitrumProxy is Diamond {
    using ERC165Storage for ERC165Storage.Layout;

    constructor() {
        ERC165Storage.Layout storage l = ERC165Storage.layout();
        l.setSupportedInterface(type(IERC165).interfaceId, true);
        l.setSupportedInterface(type(IERC1155).interfaceId, true);
    }
}
