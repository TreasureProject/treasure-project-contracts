const deployments = require('../data/deployments');

task('locked-amount').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicStaking',
    deployments.magicStakingRink,
  );

  let totalStaked = await instance.callStatic.totalStaked();
  console.log(totalStaked.toString());
  let balanceOf = await instance.callStatic.balanceOf(sender.address);
  console.log(balanceOf);
});
