// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library CardsMerkleProofClaimStorage {
    struct Layout {
        bytes32 root;
        mapping(address => mapping(uint256 => bool)) claimed;
        mapping(uint256 => address) idCollections;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('treasure.contracts.storage.CardsMerkleProofClaim');

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
