const { ethers } = require('ethers');
const deployments = require('../data/deployments');

task('stake').setAction(async function () {
  let overrides = {
    // To convert Ether to Wei:
    value: 0,
  };
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicRewards',
    deployments.magicrewards,
  );
  const erc20 = await ethers.getContractAt(
    'UniswapV2Pair',
    deployments.univ2Agld,
  );
  const approval = await erc20.connect(sender).approve(instance.address, 1);
  await approval.wait();
  const tx = await instance.connect(sender).stake(1, overrides);
  await tx.wait();
});
