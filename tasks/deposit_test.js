const deployments = require('../data/deployments');

task('deposit-test').setAction(async function () {
  let overrides = {
    // To convert Ether to Wei:
    value: 0,
  };
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'BuyOwnership',
    deployments.magicStakingTestRink,
  );

  const tx = await instance
    .connect(sender)
    .deposit(ethers.BigNumber.from('100'), overrides);
  await tx.wait();
});
