const fs = require('fs');
const deployments = require('../data/deployments');

task('cards-update-metadata').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const cardsUpdateMetadataFactory = await ethers.getContractFactory(
    'CardsUpdateMetadata',
  );
  const cardsUpdateMetadata = await cardsUpdateMetadataFactory.deploy();
  await cardsUpdateMetadata.deployed();

  const facetCuts = [
    {
      target: cardsUpdateMetadata.address,
      action: 0,
      selectors: Object.keys(cardsUpdateMetadata.interface.functions).map(
        (fn) => cardsUpdateMetadata.interface.getSighash(fn),
      ),
    },
  ];

  const collectionData = [
    {
      baseName: 'treasures',
    },
    {
      baseName: 'seedOfLife',
    },
    {
      baseName: 'legions',
    },
    {
      baseName: 'legionsGenesis',
      ipfsBase: 'Qmf2a3J62DCA6wWc6pY9xqHWyexqG17srVeAUrXiewSB1Q',
    },
    {
      baseName: 'keys',
    },
    {
      baseName: 'extraLife',
    },
  ];

  for (var collection of collectionData) {
    const address = deployments[`${collection.baseName}Arbitrum`];
    const card = await ethers.getContractAt('CardsProxy', address);

    const cutTx = await card
      .connect(deployer)
      .diamondCut(facetCuts, ethers.constants.AddressZero, '0x');
    await cutTx.wait();

    if (collection.ipfsBase) {
      console.log(`Updating metadata for ${collection.baseName}Arbitrum`);

      const updater = await ethers.getContractAt(
        'CardsUpdateMetadata',
        card.address,
      );

      const updateTx = await updater.setBaseURI(
        `https://gateway.pinata.cloud/ipfs/${collection.ipfsBase}/`,
      );
      await updateTx.wait();
    }
  }
});
