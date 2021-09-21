// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../farm/MagicStaking.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract BuyOwnership {
    address public immutable MagicToken;
    address public immutable MagicStakingContract;

    constructor(address _magicToken, address _magicStaking) {
        MagicToken = _magicToken;
        MagicStakingContract = _magicStaking;
    }

    function deposit(uint256 amount) public {
        IERC20(MagicToken).approve(MagicStakingContract, amount);
        MagicStaking(MagicStakingContract).stake(amount);
    }
}
