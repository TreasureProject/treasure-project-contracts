// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/token/ERC20/ERC20.sol';
import '@solidstate/contracts/token/ERC20/metadata/ERC20MetadataStorage.sol';

contract ERC20Mock is ERC20 {
    constructor() {
        ERC20MetadataStorage.Layout storage l = ERC20MetadataStorage.layout();
        l.name = 'test';
        l.symbol = 'ttt';
        l.decimals = 18;
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
