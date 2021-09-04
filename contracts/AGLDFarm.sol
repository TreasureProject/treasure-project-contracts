// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './IMagic.sol';

contract AGLDFarm {
    using SafeERC20 for IERC20;

    address private immutable MAGIC;
    address private immutable ADVENTURE_GOLD;
    uint256 public immutable EXPIRATION;
    uint256 private immutable RATE;

    mapping(address => uint256) public depositBalances;
    mapping(address => uint256) public depositBlocks;

    constructor(
        address magic,
        address adventureGold,
        uint256 rate,
        uint256 _EXPIRATION
    ) {
        MAGIC = magic;
        ADVENTURE_GOLD = adventureGold;
        RATE = rate;
        EXPIRATION = _EXPIRATION;
    }

    function calculateReward(address account)
        public
        view
        returns (uint256 reward)
    {
        reward =
            RATE *
            depositBalances[account] *
            (Math.min(block.number, EXPIRATION) - depositBlocks[account]);
    }

    function claimReward() public {
        uint256 reward = calculateReward(msg.sender);

        if (reward > 0) {
            IMagic(MAGIC).mint(msg.sender, reward);
        }

        depositBlocks[msg.sender] = Math.min(block.number, EXPIRATION);
    }

    function deposit(uint256 amount) external {
        claimReward();
        IERC20(ADVENTURE_GOLD).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );
        depositBalances[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external {
        require(
            depositBalances[msg.sender] >= amount,
            'AGLDFarm: insufficient balance'
        );

        claimReward();

        unchecked {
            depositBalances[msg.sender] -= amount;
        }

        IERC20(ADVENTURE_GOLD).safeTransfer(msg.sender, amount);
    }
}
