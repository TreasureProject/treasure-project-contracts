const fs = require('fs');
const deployments = require('../data/deployments');

task('add-whitelist').setAction(async function () {
  const impersonate = await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: ['0x2940108780B870Ae8f1509Be95Fdf2b6fb066E41'],
  });
  const deployer = await hre.ethers.getSigner(
    '0x2940108780B870Ae8f1509Be95Fdf2b6fb066E41',
  );

  const magicWhitelist = await ethers.getContractAt(
    'MagicWhitelist',
    deployments.magic,
  );

  await Promise.all([
    await magicWhitelist
      .connect(deployer)
      .addToWhitelist('0x70997970C51812dc3A010C7d01b50e0d17dc79C8'),
  ]);
});
