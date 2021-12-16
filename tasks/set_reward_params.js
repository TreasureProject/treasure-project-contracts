const deployments = require('../data/deployments');

task('reward-params').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicRewards',
    deployments.magicLpRewards,
  );

  // duration should be: 585000 blocks
  const tx = await instance
    .connect(sender)
    .setRewardParams(ethers.utils.parseUnits('349998', 18));
  await tx.wait();
});
