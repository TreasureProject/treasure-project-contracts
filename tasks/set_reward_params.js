const deployments = require('../data/deployments');

task('reward-params')
  .addParam('amount', '18-decimal formatted')
  .addParam('duration')
  .setAction(async function ({ amount, duration }) {
    const [sender] = await ethers.getSigners();

    const instance = await ethers.getContractAt(
      'MagicRewards',
      deployments.magicFarm,
    );

    // duration should be: 585000 blocks
    const tx = await instance
      .connect(sender)
      .setRewardParams(ethers.utils.parseUnits(amount, 18), duration);
    await tx.wait();
  });
