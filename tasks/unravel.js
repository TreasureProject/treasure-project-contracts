const deployments = require('../data/deployments');

task('unravel')
  .addParam('id')
  .setAction(async function ({ id }) {
    const [sender] = await ethers.getSigners();

    const treasure = await ethers.getContractAt(
      'Treasure',
      deployments.treasure,
    );

    const instance = await ethers.getContractAt(
      'TreasureUnraveler',
      deployments.treasureUnraveler,
    );

    if (
      !(await treasure.callStatic.isApprovedForAll(
        sender.address,
        instance.address,
      ))
    ) {
      const approveTx = await treasure
        .connect(sender)
        .setApprovalForAll(instance.address, true);
      await approveTx.wait();
    }

    const tx = await instance.connect(sender).unravel(id);
    await tx.wait();
  });
