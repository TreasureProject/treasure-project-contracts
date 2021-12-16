const fs = require('fs');
const deployments = require('../data/deployments');

task('magic-set-whitelist').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt('Magic', deployments.magic);

  const whitelist = ['0x9f43d5d6d3A96C98816bD7e4d224ad6a33F19276'];

  const tx = await instance.connect(sender).setWhitelist(whitelist);
  await tx.wait();
});
