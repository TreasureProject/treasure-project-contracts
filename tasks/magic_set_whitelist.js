const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-set-whitelist').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const instance = await ethers.getContractAt('Magic', deployments.magic);

  const whitelist = [
    deployments.agldFarm,
    deployments.lootFarm,
    deployments.treasureFarm,
  ];

  const tx = await instance.connect(sender).setWhitelist(whitelist);
  await tx.wait();
});
