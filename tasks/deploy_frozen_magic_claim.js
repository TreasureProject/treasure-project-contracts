const fs = require('fs');
const deployments = require('../data/deployments');
const tree = require('../data/frozen_magic_claim_tree.json');

task('deploy-frozen-magic-claim').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('MagicClaim', deployer);
  const instance = await factory.deploy(deployments.magicArbitrum, tree.root);
  await instance.deployed();

  console.log(`Deployed Frozen MagicClaim to: ${instance.address}`);
  deployments.frozenMagicClaim = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
