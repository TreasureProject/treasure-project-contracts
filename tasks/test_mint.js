const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-mint').setAction(async function () {
  const impersonate = await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: ['0xdCf809BBa1d9ee75c6991f1E2974163cF2555418'],
  });

  const deployer = await hre.ethers.getSigner(
    '0xdCf809BBa1d9ee75c6991f1E2974163cF2555418',
  );

  console.log(deployer.address);
  const oldMagicImplementation = await ethers.getContractAt(
    'Magic',
    deployments.magicImplementation,
  );

  const mint = await oldMagicImplementation
    .connect(deployer)
    .mint(deployer.address, 10000);
  await mint.wait();
});
