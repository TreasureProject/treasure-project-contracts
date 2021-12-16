const fs = require('fs');
const { task } = require('hardhat/config');
const deployments = require('../data/deployments');

task('custom-treasury').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance2 = await ethers.getContractAt(
    'CustomTreasuryABI',
    deployments.customTreasury,
  );

  const whitelistMagicEthBond = '0x4357Ce2c5Ef9f0d88Ae3e560232DeCF4bE3aE253';
  const whitelistMagicGOhmBond = '0x8ed2a47685e3e58c1764cf0637f706239fe277cf';

  const whitelistBond1 = await instance2
    .connect(sender)
    .whitelistBondContract(whitelistMagicEthBond);
  await whitelistBond1.wait();

  const whitelistBond2 = await instance2
    .connect(sender)
    .whitelistBondContract(whitelistMagicGOhmBond);
  await whitelistBond2.wait();
});

task('custom-bond').setAction(async function () {
  const [sender] = await ethers.getSigners();

  const instance = await ethers.getContractAt(
    'CustomBondABI',
    deployments.magicEthBond,
  );

  const instance3 = await ethers.Contract(
    'CustomBondABI',
    deployments.magicEthBond,
  );

  const instance4 = await ethers.Contract(
    'CustomBondABI',
    deployments.magicGOhmBond,
  );

  const bondTerm1 = ethers.utils.BigNumber.from('0');
  const bondTerm2 = ethers.utils.BigNumber.from('46200');

  const setBondTerms = await instance
    .connect(sender)
    .setBondTerms(bondTerm1, bondTerm2);
  await setBondTerms.wait();

  const instance2 = await ethers.getContractAt(
    'CustomBondABI',
    deployments.magicGOhmBond,
  );

  const setBondTerms2 = await instance2
    .connect(sender)
    .setBondTerms(bondTerm1, bondTerm2);
  await setBondTerms2.await();
});
