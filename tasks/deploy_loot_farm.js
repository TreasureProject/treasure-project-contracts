const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-loot-farm').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const RATE = ethers.utils
    .parseUnits('1000', 18)
    .div(ethers.BigNumber.from('6000'));

  const EXPIRATION = ethers.BigNumber.from('180000');

  const factory = await ethers.getContractFactory('LOOTFarm', deployer);
  const instance = await factory.deploy(
    deployments.magic,
    deployments.loot,
    RATE,
    EXPIRATION
  );
  await instance.deployed();

  console.log(`Deployed to: ${instance.address}`);
  deployments.lootFarm = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
