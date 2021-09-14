const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-magic-farm').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day

  const factory = await ethers.getContractFactory('MagicRewards', deployer);
  const instance = await factory.deploy(
    deployments.magic,
    deployments.univ2magic,
  );
  await instance.deployed();

  console.log(`Deployed Magic Farm to: ${instance.address}`);
  deployments.magicFarm = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
