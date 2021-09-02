task('deploy').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('Treasure', deployer);
  const instance = await factory.deploy();
  await instance.deployed();

  console.log(instance.address);
});
