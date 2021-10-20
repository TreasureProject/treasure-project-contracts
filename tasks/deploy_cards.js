const fs = require('fs');
const deployments = require('../data/deployments');
const tree = require('../data/cards_claim_tree.json');
const cards = require('../data/cards_collections.json');

task('deploy-cards').setAction(async function () {
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
  deployments.cardsMerkleProofClaim = cardsMerkleProofClaim.address;

  // deploy facets

  const cardsBaseFactory = await ethers.getContractFactory('CardsBase');
  const cardsBase = await cardsBaseFactory.deploy();
  await cardsBase.deployed();

  const cardsMintFactory = await ethers.getContractFactory('CardsMint');
  const cardsMint = await cardsMintFactory.deploy();
  await cardsMint.deployed();

  const facetCuts = [cardsBase, cardsMint].map(function (f) {
    return {
      target: f.address,
      action: 0,
      selectors: Object.keys(f.interface.functions)
        .filter((fn) => fn != 'supportsInterface(bytes4)')
        .map((fn) => f.interface.getSighash(fn)),
    };
  });

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
      ipfsBase: 'QmNaaRyyGK76iBqGenXVToGpozfAfeCfD64Hukwqr3y3VV',
    },
  ];

  const newDeployments = {};
  const ipfsToAddress = {};

  const cardsFactory = await ethers.getContractFactory('CardsProxy');

  for (let collection of collectionData) {
    const instance = await cardsFactory.deploy(cardsMerkleProofClaim.address);
    await instance.deployed();

    await instance
      .connect(deployer)
      .diamondCut(facetCuts, ethers.constants.AddressZero, '0x');

    ipfsToAddress[collection.ipfsBase] = instance.address;

    const name = `${collection.baseName}Arbitrum`;
    console.log(`Deployed ${name} to: ${instance.address}`);
    newDeployments[name] = instance.address;
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

  Object.assign(deployments, newDeployments);

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
