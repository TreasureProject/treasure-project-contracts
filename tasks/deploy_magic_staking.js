const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-magic-staking').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const _unlockTime = ethers.BigNumber.from('1632105900');
  console.log(_unlockTime.toString());

  const factory = await ethers.getContractFactory('MagicStaking', deployer);
  const instance = await factory.deploy(deployments.magicRink, _unlockTime);
  await instance.deployed();

  console.log(`Deployed Magic Staking (Rinkeby) to: ${instance.address}`);
  deployments.magicStakingRink = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
