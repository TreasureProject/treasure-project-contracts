// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library CardsMintStorage {
    struct Layout {
        mapping(address => bool) minters;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('treasure.contracts.storage.CardsMint');

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
