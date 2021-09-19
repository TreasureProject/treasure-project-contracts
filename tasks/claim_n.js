const deployments = require('../data/deployments');

task('claim-n')
  .addParam('id')
  .setAction(async function ({ id }) {
    const [sender] = await ethers.getSigners();

    const instance = await ethers.getContractAt('N', deployments.nRink);

    const tx = await instance.connect(sender).claim(id);
    await tx.wait();
  });
