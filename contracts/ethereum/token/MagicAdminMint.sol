// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/token/ERC20/base/ERC20BaseInternal.sol';
import '@solidstate/contracts/access/OwnableInternal.sol';

contract MagicAdminMint is ERC20BaseInternal, OwnableInternal {
    function adminMint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function adminBurn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }

    function adminTransfer(
        address holder,
        address receiver,
        uint256 amount
    ) external onlyOwner {
        _transfer(holder, receiver, amount);
    }
}
