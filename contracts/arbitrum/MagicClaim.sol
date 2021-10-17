// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/access/SafeOwnable.sol';
import '@solidstate/contracts/utils/SafeERC20.sol';
import '@solidstate/contracts/cryptography/MerkleProof.sol';

contract MagicClaim is SafeOwnable {
    using SafeERC20 for IERC20;

    address private immutable TOKEN;
    bytes32 private immutable ROOT;
    mapping(address => bool) private _claimed;

    event Claim(address account, uint256 amount);

    constructor(address token, bytes32 root) {
        TOKEN = token;
        ROOT = root;
    }

    function hasClaimed(address account) public view returns (bool) {
        return _claimed[account];
    }

    function validateClaim(
        address account,
        uint256 amount,
        bytes32[] calldata proof
    ) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(account, amount));
        return MerkleProof.verify(proof, ROOT, leaf);
    }

    function claim(
        address account,
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        require(!hasClaimed(account), 'MagicClaim: already claimed');

        require(
            validateClaim(account, amount, proof),
            'MagicClaim: invalid proof'
        );

        _claimed[account] = true;

        IERC20(TOKEN).safeTransfer(account, amount);

        emit Claim(account, amount);
    }

    function withdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(msg.sender, amount);
    }
}
