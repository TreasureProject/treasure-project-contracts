// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

import './IMagic.sol';

contract Magic is IMagic, ERC20 {
    address private owner;
    mapping(address => bool) private whitelist;

    constructor() ERC20('MAGIC', 'MAGIC') {
        owner = msg.sender;
    }

    function setWhitelist(address[] calldata minters) external {
        require(msg.sender == owner, 'Magic: sender must be owner');

        owner = address(0);

        for (uint256 i; i < minters.length; i++) {
            whitelist[minters[i]] = true;
        }
    }

    function mint(address account, uint256 amount) external override {
        require(whitelist[msg.sender], 'Magic: sender must be whitelisted');
        _mint(account, amount);
    }
}
