// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/interfaces/IERC1155.sol';

contract TreasureFarm is ERC20 {
    struct Item {
        string name;
        uint256 value;
    }

    address private immutable TREASURE_FRACTIONALIZER;

    mapping(uint256 => string) public itemNames;
    mapping(uint256 => uint256) public itemValues;
    mapping(address => mapping(uint256 => uint256)) public depositBalances;
    mapping(address => mapping(uint256 => uint256)) public depositBlocks;

    constructor(address fractionalizer, Item[] memory items)
        ERC20('MAGIC', 'MAGIC')
    {
        itemNames[
            uint256(keccak256('Red Feather' 'Snow White Feather'))
        ] = 'Red and White Feather';
        itemValues[
            uint256(keccak256('Red Feather' 'Snow White Feather'))
        ] = 100;

        for (uint256 i; i < items.length; i++) {
            uint256 tokenId = uint256(
                keccak256(abi.encodePacked(items[i].name))
            );
            itemNames[tokenId] = items[i].name;
            itemValues[tokenId] = items[i].value;
        }

        TREASURE_FRACTIONALIZER = fractionalizer;
    }

    function calculateReward(address account, uint256 tokenId)
        public
        view
        returns (uint256 reward)
    {
        reward =
            itemValues[tokenId] *
            depositBalances[account][tokenId] *
            (block.number - depositBlocks[account][tokenId]);
    }

    function claimReward(uint256 tokenId) public {
        uint256 reward = calculateReward(msg.sender, tokenId);

        if (reward > 0) {
            _mint(msg.sender, reward);
        }

        depositBlocks[msg.sender][tokenId] = block.number;
    }

    function deposit(uint256 tokenId, uint256 amount) external {
        claimReward(tokenId);
        IERC1155(TREASURE_FRACTIONALIZER).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ''
        );
        depositBalances[msg.sender][tokenId] += amount;
    }

    function withdraw(uint256 tokenId, uint256 amount) external {
        claimReward(tokenId);
        depositBalances[msg.sender][tokenId] -= amount;
        IERC1155(TREASURE_FRACTIONALIZER).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ''
        );
    }
}
