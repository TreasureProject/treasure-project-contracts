const deployments = require('../data/deployments');

task('fractionalize')
  .addParam('id')
  .setAction(async function ({ id }) {
    const [sender] = await ethers.getSigners();

    const treasure = await ethers.getContractAt(
      'Treasure',
      deployments.treasure,
    );

    const instance = await ethers.getContractAt(
      'TreasureFractionalizer',
      deployments.treasureFractionalizer,
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

    const tx = await instance.connect(sender).fractionalize(id);
    await tx.wait();
  });
