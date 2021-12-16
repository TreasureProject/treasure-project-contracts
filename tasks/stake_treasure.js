const deployments = require('../data/deployments');

task('stake-treasure').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'MagicTreasureStaking',
    deployments.magicTreasureStakingRink,
  );
  const erc721 = await ethers.getContractAt(
    'Treasure',
    deployments.treasureRink,
  );
  const approval = await erc721
    .connect(sender)
    .setApprovalForAll(instance.address, true);
  await approval.wait();
  const tx = await instance.connect(sender).stakeTreasure([24]);
  await tx.wait();
});
