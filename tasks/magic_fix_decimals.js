const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-fix-decimals').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const magic = await ethers.getContractAt('MagicProxy', deployments.magic);

  const magicImplementationFactory = await ethers.getContractFactory(
    'MagicDecimalFix',
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
    .diamondCut(facetCuts, ethers.constants.AddressZero, '0x', {
      nonce: ethers.BigNumber.from('16'),
      gasLimit: '1000000',
      gasPrice: ethers.utils.parseUnits('150', 'gwei'),
    });
  await cutTx.wait();

  const magicDecimalFix = await ethers.getContractAt(
    'MagicDecimalFix',
    deployments.magic,
  );
  const fixTx = await magicDecimalFix.fixDecimals();
  await fixTx.wait();
});
