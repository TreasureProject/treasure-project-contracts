// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

import './IMagic.sol';

contract Magic is IMagic, ERC20 {
    mapping(address => bool) whitelist;

    constructor(address[] memory minters) ERC20('MAGIC', 'MAGIC') {
        for (uint256 i; i < minters.length; i++) {
            whitelist[minters[i]] = true;
        }
    }

    function mint(address account, uint256 amount) external override {
        require(whitelist[msg.sender], 'Magic: sender must be whitelisted');
        _mint(account, amount);
    }
}
