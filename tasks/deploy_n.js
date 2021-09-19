const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-n').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('N', deployer);
  const instance = await factory.deploy();
  await instance.deployed();

  console.log(`Deployed nRink to: ${instance.address}`);
  deployments.nRink = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
