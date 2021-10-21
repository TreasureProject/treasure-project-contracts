// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/access/OwnableInternal.sol';
import '@solidstate/contracts/token/ERC1155/enumerable/ERC1155EnumerableInternal.sol';

import './CardsMintStorage.sol';

contract CardsMint is ERC1155EnumerableInternal, OwnableInternal {
    function mint(
        address account,
        uint256 tokenId,
        uint256 amount
    ) external {
        require(
            CardsMintStorage.layout().minters[msg.sender],
            'CardsMint: unauthorized minter'
        );
        _mint(account, tokenId, amount, '');
    }

    function addMinter(address account) external onlyOwner {
        CardsMintStorage.layout().minters[account] = true;
    }

    function removeMinter(address account) external onlyOwner {
        CardsMintStorage.layout().minters[account] = false;
    }
}
