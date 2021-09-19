// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract MagicStaking is Ownable {
    mapping(address => uint256) timeStaked;
    mapping(address => uint256) private _balances;

    IERC20 public stakedToken;

    uint256 public totalSupply;
    uint256 public unlockTime;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event TimelockEnd(uint256 timeStamp);

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function totalStaked() public view returns (uint256) {
        return stakedToken.balanceOf(address(this));
    }

    string constant _transferErrorMessage = 'staked token transfer failed';

    struct UserDeposits {
        uint256 depositAmount;
        uint256 depositTime;
    }

    constructor(IERC20 _stakedToken, uint256 _unlockTime) {
        stakedToken = _stakedToken;
        unlockTime = _unlockTime;
    }

    function stakeFor(address forWhom, uint128 amount) public payable {
        IERC20 st = stakedToken;
        timeStaked[msg.sender] = uint256(block.timestamp);
        if (st == IERC20(address(0))) {
            unchecked {
                totalSupply += msg.value;
                _balances[forWhom] += msg.value;
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
                _balances[forWhom] += amount;
            }
        }
        emit Staked(forWhom, amount);
    }

    function stake(uint128 amount) external payable {
        stakeFor(msg.sender, amount);
    }

    function withdraw(uint128 amount) public {
        require(amount <= _balances[msg.sender], 'withdraw: balance is lower');
        require(
            block.timestamp >= unlockTime,
            'withdraw: timelock has not expired'
        );
        unchecked {
            _balances[msg.sender] -= amount;
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
