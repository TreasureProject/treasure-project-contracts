const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-magic').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const magicFactory = await ethers.getContractFactory('MagicProxy');
  const magic = await magicFactory.deploy();
  await magic.deployed();

  const magicImplementationFactory = await ethers.getContractFactory('Magic');
  const magicImplementation = await magicImplementationFactory.deploy();
  await magicImplementation.deployed();

  const facetCuts = [
    {
      target: magicImplementation.address,
      action: 0,
      selectors: Object.keys(magicImplementation.interface.functions).map(
        (fn) => magicImplementation.interface.getSighash(fn),
      ),
    },
  ];

  await magic
    .connect(deployer)
    .diamondCut(facetCuts, ethers.constants.AddressZero, '0x');

  const instance = await ethers.getContractAt('Magic', magic.address);

  console.log(`Deployed Magic to: ${instance.address}`);
  deployments.magic = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
