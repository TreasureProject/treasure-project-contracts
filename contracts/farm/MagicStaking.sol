// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract MagicStaking is Ownable, ReentrancyGuard {
    //Total deposit balance
    mapping(address => uint256) public depositBalances;

    IERC20 public stakedToken;

    uint256 public totalSupply;
    uint256 public unlockTime;

    event Staked(address indexed user, uint256 amount, uint256 timeStamp);
    event Withdrawn(address indexed user, uint256 amount);
    event TimelockEnd(uint256 timeStamp);

    function balanceOf(address account) public view returns (uint256) {
        return depositBalances[account];
    }

    function totalStaked() public view returns (uint256) {
        return stakedToken.balanceOf(address(this));
    }

    function alterTimelock(uint256 _timeStamp) public onlyOwner {
        unlockTime = _timeStamp;
    }

    function _timeLock() public view returns (uint256) {
        return unlockTime;
    }

    string constant _transferErrorMessage = 'staked token transfer failed';

    constructor(IERC20 _stakedToken, uint256 _unlockTime) {
        stakedToken = _stakedToken;
        unlockTime = _unlockTime;
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

    function withdraw(uint256 amount) public nonReentrant {
        require(
            amount <= depositBalances[msg.sender],
            'withdraw: balance is lower'
        );
        require(
            block.timestamp >= unlockTime,
            'withdraw: timelock has not expired'
        );
        unchecked {
            depositBalances[msg.sender] -= amount;
            totalSupply = totalSupply - amount;
        }
        IERC20 st = stakedToken;
        if (st == IERC20(address(0))) {
            (bool success, ) = msg.sender.call{ value: amount }('');
            require(success, 'eth transfer failure');
        } else {
            require(
                stakedToken.transfer(msg.sender, amount),
                _transferErrorMessage
            );
        }
        emit Withdrawn(msg.sender, amount);
    }
}
