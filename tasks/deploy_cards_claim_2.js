const fs = require('fs');
const deployments = require('../data/deployments');
const tree = require('../data/cards_claim_tree_2.json');
const cards = require('../data/cards_collections.json');

task('deploy-cards-claim-2').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // deploy claim contract (configure later)

  const cardsMerkleProofClaimFactory = await ethers.getContractFactory(
    'CardsMerkleProofClaim',
  );
  const cardsMerkleProofClaim = await cardsMerkleProofClaimFactory.deploy();
  await cardsMerkleProofClaim.deployed();

  console.log(
    `Deployed CardsMerkleProofClaim to: ${cardsMerkleProofClaim.address}`,
  );
  deployments.cardsMerkleProofClaim2 = cardsMerkleProofClaim.address;

  const collectionData = [
    {
      baseName: 'treasures',
      ipfsBase: 'QmXkP9NjTaW5Dx4mhnYzXCfp1iUDqubvxNimqo6ZXkeKuX',
    },
    {
      baseName: 'seedOfLife',
      ipfsBase: 'QmVpJUkiDHBBPHCJnj5VAKizxpqufPuA7zJVWKwHpRVSVM',
    },
    {
      baseName: 'legions',
      ipfsBase: 'QmZ1sSWRXt6dd4jJQrWp6wfLBxf9nmRoSvpPhSBCxaMGc3',
    },
    {
      baseName: 'legionsGenesis',
      ipfsBase: 'QmXqHecFPPFgsZivrREchua466pbUF4WTb7SQcfH2f1GK3',
    },
    {
      baseName: 'keys',
      ipfsBase: 'QmWy8Zx4goK97fJgPqUgixaXWLbPcwCH72bzM5nSrWn2uT',
    },
    {
      baseName: 'extraLife',
      ipfsBase: 'QmYX3wDGawC2sBHW9GMuBkiE8UmaEqJu4hDwmFeKwQMZYj',
    },
  ];

  const ipfsToAddress = {};

  for (let collection of collectionData) {
    const instance = await ethers.getContractAt(
      'CardsMint',
      deployments[`${collection.baseName}Arbitrum`],
    );

    ipfsToAddress[collection.ipfsBase] = instance.address;

    const addMinterTx = await instance.addMinter(cardsMerkleProofClaim.address);
    await addMinterTx.wait();
  }

  const ids = [];
  const collections = [];

  for (var card of cards) {
    ids.push(ethers.BigNumber.from(card.tokenId));
    collections.push(ipfsToAddress[card.ipfsRoot]);
  }

  const setRootTx = await cardsMerkleProofClaim.setMigratedCardsClaimRoot(
    tree.root,
  );
  await setRootTx.wait();
  const setIdCollectionsTx = await cardsMerkleProofClaim.setIdCollections(
    ids,
    collections,
  );
  await setIdCollectionsTx.wait();

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
