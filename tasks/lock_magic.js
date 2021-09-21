const deployments = require('../data/deployments');

task('lock-magic').setAction(async function () {
  let overrides = {
    // To convert Ether to Wei:
    value: 0,
  };
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicStaking',
    deployments.magicStakingRink,
  );
  const erc20 = await ethers.getContractAt('Magic', deployments.magicRink);
  const approval = await erc20
    .connect(sender)
    .approve(instance.address, ethers.BigNumber.from('150'));
  await approval.wait();
  const tx = await instance
    .connect(sender)
    .stake(ethers.BigNumber.from('150'), overrides);
  await tx.wait();
});
