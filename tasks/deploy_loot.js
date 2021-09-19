const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-loot').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('Loot', deployer);
  const instance = await factory.deploy();
  await instance.deployed();

  console.log(`Deployed lootRink to: ${instance.address}`);
  deployments.lootRink = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
