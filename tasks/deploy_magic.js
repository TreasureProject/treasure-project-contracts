const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-magic').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('Magic', deployer);
  const instance = await factory.deploy();
  await instance.deployed();

  console.log(`Deployed Magic to: ${instance.address}`);
  deployments.magic = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
