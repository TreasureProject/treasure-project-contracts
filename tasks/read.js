const deployments = require('../data/deployments');

task('read')
  .addParam('id')
  .setAction(async function ({ id }) {
    const [sender] = await ethers.getSigners();

    const instance = await ethers.getContractAt(
      'Treasure',
      deployments.treasure,
    );

    console.log(await instance.callStatic.getAsset1(id));
    console.log(await instance.callStatic.getAsset2(id));
    console.log(await instance.callStatic.getAsset3(id));
    console.log(await instance.callStatic.getAsset4(id));
    console.log(await instance.callStatic.getAsset5(id));
    console.log(await instance.callStatic.getAsset6(id));
    console.log(await instance.callStatic.getAsset7(id));
    console.log(await instance.callStatic.getAsset8(id));
  });
