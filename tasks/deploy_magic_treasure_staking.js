const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-magic-treasure-staking').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day

  const factory = await ethers.getContractFactory(
    'MagicTreasureStaking',
    deployer,
  );
  const instance = await factory.deploy(
    deployments.magic,
    deployments.treasure,
  );
  await instance.deployed();

  console.log(`Deployed Magic Farm to: ${instance.address}`);
  deployments.magicTreasureStaking = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
