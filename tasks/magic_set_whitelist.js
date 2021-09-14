const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-set-whitelist').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt('Magic', deployments.magic);

  const whitelist = [
    deployments.agldFarm,
    deployments.lootFarm,
    deployments.nFarm,
    deployments.treasureFarm,
    '0xf9026d050520E501b45c6f39efCbE0969870311A',
  ];

  const tx = await instance.connect(sender).setWhitelist(whitelist);
  await tx.wait();
});
