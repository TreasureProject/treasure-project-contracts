// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/access/OwnableInternal.sol';
import '@solidstate/contracts/token/ERC20/base/ERC20BaseInternal.sol';

import './MagicWhitelistStorage.sol';

contract MagicWhitelist is OwnableInternal, ERC20BaseInternal {
    function addToWhitelist(address account) external onlyOwner {
        MagicWhitelistStorage.layout().whitelist[account] = true;
    }

    function removeFromWhitelist(address account) external onlyOwner {
        MagicWhitelistStorage.layout().whitelist[account] = false;
    }

    function mint(address account, uint256 amount) external {
        require(
            MagicWhitelistStorage.layout().whitelist[msg.sender],
            'Magic: sender must be whitelisted'
        );
        _mint(account, amount);
    }
}
