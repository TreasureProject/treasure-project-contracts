const deployments = require('../data/deployments');

task('claim')
  .addParam('id')
  .setAction(async function ({ id }) {
    const [sender] = await ethers.getSigners();

    const instance = await ethers.getContractAt(
      'Treasure',
      deployments.treasure,
    );

    const tx = await instance.connect(sender).claim(id);
    await tx.wait();
  });
