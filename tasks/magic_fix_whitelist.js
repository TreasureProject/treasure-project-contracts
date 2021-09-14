const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-fix-whitelist').setAction(async function () {
  const impersonate = await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: ['0x2940108780B870Ae8f1509Be95Fdf2b6fb066E41'],
  });
  const deployer = await hre.ethers.getSigner(
    '0x2940108780B870Ae8f1509Be95Fdf2b6fb066E41',
  );

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

  const magicWhitelist = await ethers.getContractAt(
    'MagicWhitelist',
    deployments.magic,
  );

  console.log(deployments.agldFarm);
  await Promise.all([
    await magicWhitelist.connect(deployer).addToWhitelist(deployments.agldFarm),
    await magicWhitelist.connect(deployer).addToWhitelist(deployments.lootFarm),
    await magicWhitelist
      .connect(deployer)
      .addToWhitelist(deployments.treasureFarm),
    await magicWhitelist.connect(deployer).addToWhitelist(deployments.nFarm),
    await magicWhitelist
      .connect(deployer)
      .addToWhitelist('0xEc834bD1F492a8Bd5aa71023550C44D4fB14632A'),
  ]);
});
