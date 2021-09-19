const deployments = require('../data/deployments');

task('withdraw-reward').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicRewards',
    deployments.magicFarm,
  );

  // duration should be: 585000 blocks
  const tx = await instance.connect(sender).withdrawReward();
  await tx.wait();
});
