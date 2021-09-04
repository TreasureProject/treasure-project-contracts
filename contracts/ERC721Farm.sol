// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/interfaces/IERC721Receiver.sol';

import './IMagic.sol';

contract ERC721Farm is IERC721Receiver {
    address private immutable MAGIC;
    address private immutable ERC721_CONTRACT;
    uint256 public immutable EXPIRATION;
    uint256 private immutable RATE;

    mapping(address => mapping(uint256 => bool)) public deposits;
    mapping(address => mapping(uint256 => uint256)) public depositBlocks;

    constructor(
        address magic,
        address erc721,
        uint256 rate
    ) {
        MAGIC = magic;
        ERC721_CONTRACT = erc721;
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
            (deposits[msg.sender][tokenId] ? 1 : 0) *
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

    function deposit(uint256 tokenId) public {
        claimReward(tokenId);
        IERC721(ERC721_CONTRACT).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            ''
        );
        deposits[msg.sender][tokenId] = true;
    }

    function depositBatch(uint256[] calldata tokenIds) external {
        for (uint256 i; i < tokenIds.length; i++) {
            deposit(tokenIds[i]);
        }
    }

    function withdraw(uint256 tokenId) public {
        require(
            deposits[msg.sender][tokenId],
            'ERC721Farm: token not deposited'
        );

        claimReward(tokenId);

        deposits[msg.sender][tokenId] = false;

        IERC721(ERC721_CONTRACT).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            ''
        );
    }

    function withdrawBatch(uint256[] calldata tokenIds) external {
        for (uint256 i; i < tokenIds.length; i++) {
            withdraw(tokenIds[i]);
        }
    }
}
