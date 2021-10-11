const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-treasure-arbitrum').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const treasureArbitrumFactory = await ethers.getContractFactory(
    'TreasureArbitrumProxy',
  );
  const treasureArbitrum = await treasureArbitrumFactory.deploy();
  await treasureArbitrum.deployed();

  const treasureArbitrumImplementationFactory = await ethers.getContractFactory(
    'Magic',
  );
  const treasureArbitrumImplementation =
    await treasureArbitrumImplementationFactory.deploy();
  await treasureArbitrumImplementation.deployed();

  const facetCuts = [
    {
      target: treasureArbitrumImplementation.address,
      action: 0,
      selectors: Object.keys(
        treasureArbitrumImplementation.interface.functions,
      ).map((fn) => treasureArbitrumImplementation.interface.getSighash(fn)),
    },
  ];

  await treasureArbitrum
    .connect(deployer)
    .diamondCut(facetCuts, ethers.constants.AddressZero, '0x');

  const instance = await ethers.getContractAt(
    'Magic',
    treasureArbitrum.address,
  );

  console.log(`Deployed TreasureArbitrum to: ${instance.address}`);
  deployments.treasureArbitrum = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
