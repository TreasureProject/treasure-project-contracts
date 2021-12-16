const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-magic-test').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('Magic', deployer);
  const instance = await factory.deploy();
  await instance.deployed();

  console.log(`Deployed Magic Mainnet Test to: ${instance.address}`);
  deployments.magicMainnetTest = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
