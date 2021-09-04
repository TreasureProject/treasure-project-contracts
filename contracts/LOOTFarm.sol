// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/interfaces/IERC721Receiver.sol';

import './IMagic.sol';

contract LOOTFarm is IERC721Receiver {
    address private immutable MAGIC;
    address private immutable LOOT;
    uint256 public immutable EXPIRATION;
    uint256 private immutable RATE;

    mapping(address => mapping(uint256 => bool)) public deposits;
    mapping(address => mapping(uint256 => uint256)) public depositBlocks;

    constructor(
        address magic,
        address loot,
        uint256 rate
    ) {
        MAGIC = magic;
        LOOT = loot;
        RATE = rate;
        EXPIRATION = block.number + 6000 * 30;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function calculateReward(address account, uint256 tokenId)
        public
        view
        returns (uint256 reward)
    {
        reward =
            RATE *
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

    function deposit(uint256 tokenId) external {
        claimReward(tokenId);
        IERC721(LOOT).safeTransferFrom(msg.sender, address(this), tokenId, '');
        deposits[msg.sender][tokenId] = true;
    }

    function withdraw(uint256 tokenId) external {
        require(
            deposits[msg.sender][tokenId],
            'LOOTFarm: token not desposited'
        );

        claimReward(tokenId);

        deposits[msg.sender][tokenId] = false;

        IERC721(LOOT).safeTransferFrom(address(this), msg.sender, tokenId, '');
    }
}
