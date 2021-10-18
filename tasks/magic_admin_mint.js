const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-admin-mint').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const magic = await ethers.getContractAt('MagicProxy', deployments.magic);

  const magicImplementationFactory = await ethers.getContractFactory(
    'MagicAdminMint',
  );
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

  const cutTx = await magic
    .connect(deployer)
    .diamondCut(facetCuts, ethers.constants.AddressZero, '0x', {});
  await cutTx.wait();
});
