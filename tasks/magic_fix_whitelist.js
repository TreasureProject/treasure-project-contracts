const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-fix-whitelist').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const magic = await ethers.getContractAt('MagicProxy', deployments.magic);

  const oldMagicImplementation = await ethers.getContractAt(
    'Magic',
    deployments.magicImplementation,
  );

  const magicImplementationFactory = await ethers.getContractFactory(
    'MagicWhitelist',
  );
  const magicImplementation = await magicImplementationFactory.deploy();
  await magicImplementation.deployed();

  const facetCuts = [
    {
      target: ethers.constants.AddressZero,
      action: 2,
      selectors: [
        oldMagicImplementation.interface.getSighash('mint(address,uint256)'),
        oldMagicImplementation.interface.getSighash('setWhitelist(address[])'),
      ],
    },
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
    .diamondCut(facetCuts, ethers.constants.AddressZero, '0x');
  await cutTx.wait();
});
