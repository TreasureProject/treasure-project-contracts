const deployments = require('../data/deployments');

task('reward-params').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicRewardsArbitrum',
    deployments.magicRewardsArbitrum,
  );

  const amount = ethers.utils.parseUnits('3600000', 18);

  const duration = ethers.BigNumber.from('2592000');

  // duration should be: 585000 blocks
  const tx = await instance
    .connect(sender)
    .setRewardParams(ethers.utils.parseUnits(amount, 18), duration);
  await tx.wait();
});
