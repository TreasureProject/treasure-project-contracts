const fs = require('fs');
const deployments = require('../data/deployments');
const items = require('../data/items');

task('deploy-fractionalizer').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory(
    'TreasureFractionalizer',
    deployer,
  );
  const instance = await factory.deploy(
    deployments.treasure,
    items.map((i) => i.name),
  );
  await instance.deployed();

  console.log(`Deployed to: ${instance.address}`);
  deployments.treasureFractionalizer = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
