const fs = require('fs');
const deployments = require('../data/deployments');
const items = require('../data/items');

task('deploy-treasure-farm').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const RATE_MULTIPLIER = ethers.utils
    .parseUnits('1', 18)
    .div(ethers.BigNumber.from('6000'));

  const EXPIRATION = ethers.BigNumber.from('180000');

  const factory = await ethers.getContractFactory('TreasureFarm', deployer);
  const instance = await factory.deploy(
    deployments.magic,
    deployments.treasureUnraveler,
    EXPIRATION,
    items.map((i) => [
      i.name,
      ethers.BigNumber.from(i.value).mul(RATE_MULTIPLIER),
    ]),
  );
  await instance.deployed();

  console.log(`Deployed to: ${instance.address}`);
  deployments.treasureFarm = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
