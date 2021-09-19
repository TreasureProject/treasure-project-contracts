const deployments = require('../data/deployments');

task('read_reward_rate').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicRewards',
    deployments.magicFarm,
  );

  reward = await instance.callStatic.rewardPerToken();
  console.log(ethers.utils.formatEther(reward));
  rewardapplicable = await instance.callStatic.lastTimeRewardApplicable();
  console.log(ethers.utils.rewardapplicable);
  rewardRate = await instance.callStatic.rewardRate();
  console.log(ethers.utils.formatEther(rewardRate));
});
