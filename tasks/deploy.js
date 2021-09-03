const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('Treasure', deployer);
  const instance = await factory.deploy();
  await instance.deployed();

  console.log(`Deployed to: ${instance.address}`);
  deployments.treasure = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
