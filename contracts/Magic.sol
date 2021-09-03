// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

import './IMagic.sol';

contract Magic is IMagic, ERC20 {
    constructor() ERC20('MAGIC', 'MAGIC') {}

    function mint(address account, uint256 amount) external override {
        // TODO: permissions
        _mint(account, amount);
    }
}
