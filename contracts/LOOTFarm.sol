// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './ERC721Farm.sol';

contract LOOTFarm is ERC721Farm {
    constructor(
        address magic,
        address loot,
        uint256 rate
    ) ERC721Farm(magic, loot, rate) {}
}
