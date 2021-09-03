const deployments = require('../data/deployments');

task('fractionalize')
  .addParam('name')
  .setAction(async function ({ name }) {
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
      await treasure.connect(sender).setApprovalForAll(instance.address);
    }

    const tx = await instance
      .connect(sender)
      .fractionalize(ethers.utils.solidityKeccak256(['string'], [name]));
    await tx.wait();
  });
