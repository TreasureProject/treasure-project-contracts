const deployments = require('../data/deployments');

task('reward-params')
  .addParam('amount')
  .addParam('duration')
  .setAction(async function ({ amount, duration }) {
    const [sender] = await ethers.getSigners();

    const instance = await ethers.getContractAt(
      'MagicRewards',
      deployments.magicFarm,
    );

    // duration should be: 118125 blocks
    // COMMENT: @NickBarry do I need to do anything special to this amount? I would like to make sure we are emitting 166k tokens in the first week.
    // Does it need to be passed as a big number?
    const tx = await instance.connect(sender).setRewardParams(amount, duration);
    await tx.wait();
  });
