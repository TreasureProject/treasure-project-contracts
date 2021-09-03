// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/interfaces/IERC1155.sol';
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';

import './IMagic.sol';

contract TreasureFarm is ERC1155Receiver {
    struct Item {
        string name;
        uint256 value;
    }

    address private immutable MAGIC;
    address private immutable TREASURE_FRACTIONALIZER;
    uint256 public immutable EXPIRATION;

    mapping(uint256 => uint256) public itemValues;
    mapping(address => mapping(uint256 => uint256)) public depositBalances;
    mapping(address => mapping(uint256 => uint256)) public depositBlocks;

    constructor(
        address magic,
        address fractionalizer,
        Item[] memory items
    ) {
        for (uint256 i; i < items.length; i++) {
            uint256 tokenId = uint256(
                keccak256(abi.encodePacked(items[i].name))
            );
            itemValues[tokenId] = items[i].value;
        }

        MAGIC = magic;
        TREASURE_FRACTIONALIZER = fractionalizer;
        EXPIRATION = block.number + 6000 * 30;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function calculateReward(address account, uint256 tokenId)
        public
        view
        returns (uint256 reward)
    {
        reward =
            itemValues[tokenId] *
            depositBalances[account][tokenId] *
            (Math.min(block.number, EXPIRATION) -
                depositBlocks[account][tokenId]);
    }

    function claimReward(uint256 tokenId) public {
        uint256 reward = calculateReward(msg.sender, tokenId);

        if (reward > 0) {
            IMagic(MAGIC).mint(msg.sender, reward);
        }

        depositBlocks[msg.sender][tokenId] = Math.min(block.number, EXPIRATION);
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
        require(
            depositBalances[msg.sender][tokenId] >= amount,
            'TreasureFarm: insufficient balance'
        );

        claimReward(tokenId);

        unchecked {
            depositBalances[msg.sender][tokenId] -= amount;
        }

        IERC1155(TREASURE_FRACTIONALIZER).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ''
        );
    }
}
