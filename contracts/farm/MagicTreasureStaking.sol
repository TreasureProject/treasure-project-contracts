// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@solidstate/contracts/utils/EnumerableSet.sol';

contract MagicTreasureStaking is Ownable, ReentrancyGuard, IERC721Receiver {
    using EnumerableSet for EnumerableSet.UintSet;

    //Total deposit balance
    mapping(address => uint256) public depositBalances;
    //ERC721 deposits
    mapping(address => EnumerableSet.UintSet) private _deposits;

    IERC20 public stakedToken;
    address public ERC721_CONTRACT;

    uint256 public totalSupply;

    event StakedTreasure(address indexed user, uint256[] tokenIds);
    event Staked(address indexed user, uint256 amount, uint256 timeStamp);

    function balanceOf(address account) public view returns (uint256) {
        return depositBalances[account];
    }

    function totalStaked() public view returns (uint256) {
        return stakedToken.balanceOf(address(this));
    }

    string constant _transferErrorMessage = 'staked token transfer failed';

    constructor(IERC20 _stakedToken, address _treasureContract) {
        stakedToken = _stakedToken;
        ERC721_CONTRACT = _treasureContract;
    }

    function stakeFor(address forWhom, uint256 amount) public payable {
        IERC20 st = stakedToken;

        if (st == IERC20(address(0))) {
            unchecked {
                totalSupply += msg.value;
                depositBalances[forWhom] += msg.value;
            }
        } else {
            require(msg.value == 0, 'non-zero eth');
            require(amount > 0, 'Cannot stake 0');
            require(
                st.transferFrom(msg.sender, address(this), amount),
                _transferErrorMessage
            );
            unchecked {
                totalSupply += amount;
                depositBalances[forWhom] += amount;
            }
        }
        emit Staked(forWhom, amount, uint256(block.timestamp));
    }

    function stake(uint256 amount) external payable {
        require(msg.sender == tx.origin, 'humans only please.');
        stakeFor(msg.sender, amount);
    }

    function stakeTreasure(uint256[] calldata _tokenIds) external {
        for (uint256 i; i < _tokenIds.length; i++) {
            IERC721(ERC721_CONTRACT).safeTransferFrom(
                msg.sender,
                address(this),
                _tokenIds[i],
                ''
            );

            _deposits[msg.sender].add(_tokenIds[i]);
        }
        emit StakedTreasure(msg.sender, _tokenIds);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
