// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/interfaces/IERC1155.sol';


contract TreasureFarm is ERC20 {
  struct Item {
    string name;
    uint value;
  }

  address private immutable TREASURE_FRACTIONS;

  mapping (uint256 => string) public itemNames;
  mapping (uint256 => uint256) public itemValues;
  mapping (address => mapping (uint256 => uint256)) public depositBalances;
  mapping (address => mapping (uint256 => uint256)) public depositBlocks;

  constructor (address fractions, Item[] memory items) ERC20('TODO', 'TODO') {
    itemNames[uint256(keccak256("Red Feather""Snow White Feather"))] = "Red and White Feather";
    itemValues[uint256(keccak256("Red Feather""Snow White Feather"))] = 100;

    for (uint i; i < items.length; i++) {
      uint tokenId = uint256(keccak256(abi.encodePacked(items[i].name)));
      itemNames[tokenId] = items[i].name;
      itemValues[tokenId] = items[i].value;
    }

    TREASURE_FRACTIONS = fractions;
  }

  function claimReward (uint tokenId) public {
    uint amount = itemValues[tokenId] * depositBalances[msg.sender][tokenId] * (block.number - depositBlocks[msg.sender][tokenId]);

    if (amount > 0) {
      _mint(msg.sender, amount);
    }

    depositBlocks[msg.sender][tokenId] = block.number;
  }

  function deposit (uint tokenId, uint amount) external {
    claimReward(tokenId);
    IERC1155(TREASURE_FRACTIONS).safeTransferFrom(msg.sender, address(this), tokenId, amount, '');
    depositBalances[msg.sender][tokenId] += amount;
  }

  function withdraw (uint tokenId, uint amount) external {
    claimReward(tokenId);
    depositBalances[msg.sender][tokenId] -= amount;
    IERC1155(TREASURE_FRACTIONS).safeTransferFrom(address(this), msg.sender, tokenId, amount, '');
  }
}
