const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-agld-farm').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const RATE = ethers.utils
    .parseUnits('0.1', 18)
    .div(ethers.BigNumber.from('6000'));

  const EXPIRATION = ethers.BigNumber.from('180000');

  const factory = await ethers.getContractFactory('AGLDFarm', deployer);
  const instance = await factory.deploy(
    deployments.magic,
    deployments.adventureGold,
    RATE,
    EXPIRATION,
  );
  await instance.deployed();

  console.log(`Deployed AGLDFarm to: ${instance.address}`);
  deployments.agldFarm = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
