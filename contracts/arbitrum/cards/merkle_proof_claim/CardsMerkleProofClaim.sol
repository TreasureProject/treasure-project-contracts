// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@solidstate/contracts/access/SafeOwnable.sol';
import '@solidstate/contracts/cryptography/MerkleProof.sol';

import '../CardsMint.sol';
import './CardsMerkleProofClaimStorage.sol';

contract CardsMerkleProofClaim is SafeOwnable {
    event Claim(address account, uint256 tokenId, uint256 amount);

    function setIdCollections(
        uint256[] calldata ids,
        address[] calldata collections
    ) public onlyOwner {
        require(
            ids.length == collections.length,
            'CardsMerkleProofClaim: invalid lengths'
        );

        mapping(uint256 => address)
            storage idCollections = CardsMerkleProofClaimStorage
                .layout()
                .idCollections;

        for (uint256 i; i < ids.length; i++) {
            idCollections[ids[i]] = collections[i];
        }
    }

    function setMigratedCardsClaimRoot(bytes32 root) external onlyOwner {
        CardsMerkleProofClaimStorage.layout().root = root;
    }

    function hasClaimedMigratedCards(address account, uint256 id)
        public
        view
        returns (bool)
    {
        return CardsMerkleProofClaimStorage.layout().claimed[account][id];
    }

    function validateMigratedCardsClaim(
        address account,
        uint256 id,
        uint256 amount,
        bytes32[] calldata proof
    ) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(account, id, amount));
        return
            MerkleProof.verify(
                proof,
                CardsMerkleProofClaimStorage.layout().root,
                leaf
            );
    }

    function claimMigratedCards(
        address account,
        uint256 id,
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        require(
            !hasClaimedMigratedCards(account, id),
            'CardsMerkleProofClaim: already claimed'
        );

        require(
            validateMigratedCardsClaim(account, id, amount, proof),
            'MagicClaim: invalid proof'
        );

        CardsMerkleProofClaimStorage.Layout
            storage l = CardsMerkleProofClaimStorage.layout();
        l.claimed[account][id] = true;

        CardsMint(l.idCollections[id]).mint(account, id, amount);

        emit Claim(account, id, amount);
    }
}
