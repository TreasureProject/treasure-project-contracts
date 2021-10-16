// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/token/ERC20/metadata/ERC20MetadataStorage.sol';

contract MagicDecimalFix {
    function fixDecimals() external {
        ERC20MetadataStorage.layout().decimals = 18;
    }
}
