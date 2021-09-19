const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-mint').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  console.log(deployer.address);

  // MagicProxy address + Magic ABI
  const magic = await ethers.getContractAt('Magic', deployments.magic);

  const mint = await magic.connect(deployer).mint(deployer.address, 10000);
  await mint.wait();
});
