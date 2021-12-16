const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-magic-farmz').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day

  const factory = await ethers.getContractFactory(
    'MagicRewardsArbitrum',
    deployer,
  );
  const instance = await factory.deploy(
    deployments.magicArbitrum,
    deployments.slpArbitrum,
  );
  await instance.deployed();

  console.log(`Deployed magicRewardsArbitrum to: ${instance.address}`);
  deployments.magicRewardsArbitrum = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
