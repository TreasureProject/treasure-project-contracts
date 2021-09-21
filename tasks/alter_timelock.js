const deployments = require('../data/deployments');

task('alter-timelock').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicStaking',
    deployments.magicStakingRink,
  );

  // duration should be: 585000 blocks
  const tx = await instance
    .connect(sender)
    .alterTimelock(ethers.BigNumber.from('1632113100'));
  await tx.wait();
});
