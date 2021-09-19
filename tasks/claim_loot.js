const deployments = require('../data/deployments');

task('claim-loot')
  .addParam('id')
  .setAction(async function ({ id }) {
    const [sender] = await ethers.getSigners();

    const instance = await ethers.getContractAt('Loot', deployments.lootRink);

    const tx = await instance.connect(sender).claim(id);
    await tx.wait();
  });
