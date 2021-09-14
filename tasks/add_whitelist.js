const fs = require('fs');
const deployments = require('../data/deployments');

task('add-whitelist').setAction(async function () {
  const [deployer] = await ethers.getSigners();

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
