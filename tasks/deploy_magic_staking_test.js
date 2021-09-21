const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-magic-staking-test').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day

  const factory = await ethers.getContractFactory('BuyOwnership', deployer);
  const instance = await factory.deploy(
    deployments.magicRink,
    deployments.magicStakingRink,
  );
  await instance.deployed();

  console.log(`Deployed Magic Staking (Rinkeby) to: ${instance.address}`);
  deployments.magicStakingTestRink = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
