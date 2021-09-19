// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/token/ERC20/base/ERC20BaseInternal.sol';
import '@solidstate/contracts/utils/ReentrancyGuard.sol';

import './MagicWhitelistStorage.sol';

contract MagicMintReentrancyFix is ERC20BaseInternal, ReentrancyGuard {
    function mint(address account, uint256 amount) external nonReentrant {
        require(
            MagicWhitelistStorage.layout().whitelist[msg.sender],
            'Magic: sender must be whitelisted'
        );
        _mint(account, amount);
    }
}
