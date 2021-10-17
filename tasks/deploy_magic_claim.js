const fs = require('fs');
const deployments = require('../data/deployments');
const tree = require('../data/magic_claim_tree.json');

task('deploy-magic-claim').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('MagicClaim', deployer);
  const instance = await factory.deploy(deployments.magicArbitrum, tree.root);
  await instance.deployed();

  console.log(`Deployed MagicClaim to: ${instance.address}`);
  deployments.magicClaim = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
