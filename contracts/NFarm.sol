// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './ERC721Farm.sol';

contract NFarm is ERC721Farm {
    constructor(
        address magic,
        address n,
        uint256 rate,
        uint256 deadline
    ) ERC721Farm(magic, n, rate, deadline) {}
}
