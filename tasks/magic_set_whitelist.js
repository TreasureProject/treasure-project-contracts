const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-set-whitelist').setAction(async function () {
  const impersonate = await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: ['0x2940108780B870Ae8f1509Be95Fdf2b6fb066E41'],
  });
  const sender = await hre.ethers.getSigner(
    '0x2940108780B870Ae8f1509Be95Fdf2b6fb066E41',
  );

  const instance = await ethers.getContractAt('Magic', deployments.magic);

  const whitelist = [
    deployments.agldFarm,
    deployments.lootFarm,
    deployments.nFarm,
    deployments.treasureFarm,
  ];

  const tx = await instance.connect(sender).setWhitelist(whitelist);
  await tx.wait();
});
