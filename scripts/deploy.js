async function main() {
  const [deployer] = await ethers.getSigners();

  const factory = await ethers.getContractFactory('Treasure', deployer);
  const instance = await factory.deploy();
  await instance.deployed();

  console.log(instance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
