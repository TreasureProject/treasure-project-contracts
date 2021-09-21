const deployments = require('../data/deployments');

task('withdraw-locked').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicStaking',
    deployments.magicStakingRink,
  );

  // duration should be: 585000 blocks
  const tx = await instance
    .connect(sender)
    .withdraw(ethers.BigNumber.from('1000'));
  await tx.wait();
});
