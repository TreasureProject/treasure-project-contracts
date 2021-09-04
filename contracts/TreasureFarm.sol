// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/interfaces/IERC1155.sol';
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';

import './IMagic.sol';

contract TreasureFarm is ERC1155Receiver {
    using EnumerableSet for EnumerableSet.UintSet;

    struct Item {
        string name;
        uint256 value;
    }

    address private immutable MAGIC;
    address private immutable TREASURE_UNRAVELER;
    uint256 public immutable EXPIRATION;

    mapping(uint256 => uint256) public itemValues;

    mapping(address => EnumerableSet.UintSet) private _deposits;
    mapping(address => mapping(uint256 => uint256)) public depositBalances;
    mapping(address => mapping(uint256 => uint256)) public depositBlocks;

    constructor(
        address magic,
        address unraveler,
        uint256 expiration,
        Item[] memory items
    ) {
        for (uint256 i; i < items.length; i++) {
            uint256 tokenId = uint256(
                keccak256(abi.encodePacked(items[i].name))
            );
            itemValues[tokenId] = items[i].value;
        }

        MAGIC = magic;
        TREASURE_UNRAVELER = unraveler;
        EXPIRATION = block.number + expiration;
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

    function depositsOf(address account)
        external
        view
        returns (uint256[] memory)
    {
        EnumerableSet.UintSet storage depositSet = _deposits[account];
        uint256[] memory tokenIds = new uint256[](depositSet.length());

        for (uint256 i; i < depositSet.length(); i++) {
            tokenIds[i] = depositSet.at(i);
        }

        return tokenIds;
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

    function claimReward(uint256[] calldata tokenIds) public {
        uint256 reward;
        uint256 block = Math.min(block.number, EXPIRATION);

        for (uint256 i; i < tokenIds.length; i++) {
            reward += calculateReward(msg.sender, tokenIds[i]);

            depositBlocks[msg.sender][tokenIds[i]] = block;
        }

        if (reward > 0) {
            IMagic(MAGIC).mint(msg.sender, reward);
        }
    }

    function deposit(uint256[] calldata tokenIds, uint256[] calldata amounts)
        external
    {
        require(
            tokenIds.length == amounts.length,
            'TreasureFarm: array length mismatch'
        );

        claimReward(tokenIds);

        for (uint256 i; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            uint256 amount = amounts[i];

            IERC1155(TREASURE_UNRAVELER).safeTransferFrom(
                msg.sender,
                address(this),
                tokenId,
                amount,
                ''
            );

            _deposits[msg.sender].add(tokenId);
            depositBalances[msg.sender][tokenId] += amount;
        }
    }

    function withdraw(uint256[] calldata tokenIds, uint256[] calldata amounts)
        external
    {
        require(
            tokenIds.length == amounts.length,
            'TreasureFarm: array length mismatch'
        );

        claimReward(tokenIds);

        for (uint256 i; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            uint256 amount = amounts[0];

            require(
                depositBalances[msg.sender][tokenId] >= amount,
                'TreasureFarm: insufficient balance'
            );

            unchecked {
                depositBalances[msg.sender][tokenId] -= amount;
            }

            if (depositBalances[msg.sender][tokenId] == 0) {
                _deposits[msg.sender].remove(tokenId);
            }

            IERC1155(TREASURE_UNRAVELER).safeTransferFrom(
                address(this),
                msg.sender,
                tokenId,
                amount,
                ''
            );
        }
    }
}
