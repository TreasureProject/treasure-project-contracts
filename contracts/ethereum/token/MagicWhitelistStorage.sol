// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

library MagicWhitelistStorage {
    struct Layout {
        mapping(address => bool) whitelist;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('treasure.contracts.storage.MagicWhitelist');

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
