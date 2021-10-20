// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/introspection/ERC165.sol';
import '@solidstate/contracts/token/ERC1155/enumerable/ERC1155Enumerable.sol';

contract CardsBase is ERC1155Enumerable, ERC165 {}
