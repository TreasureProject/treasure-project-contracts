const { ethers } = require('ethers');
const fs = require('fs');
const deployments = require('../data/deployments');

task('deploy-otc-escrow-john').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0x52D81c84845f25dC2f481243dB8e6176A0FCB338';
  const magicGov = '0x52D81c84845f25dC2f481243dB8e6176A0FCB338';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('7827582', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenJohn to: ${instance.address}`);
  deployments.teamTokenJohn = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-yuta').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0x52D81c84845f25dC2f481243dB8e6176A0FCB338';
  const magicGov = '0x52D81c84845f25dC2f481243dB8e6176A0FCB338';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('7827582', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenYuta to: ${instance.address}`);
  deployments.teamTokenYuta = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-nick').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '';
  const magicGov = '';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('1746603', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenNick to: ${instance.address}`);
  deployments.teamTokenNick = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-bong').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0x945fE27749F564173237FdDF47749b676a14111F';
  const magicGov = '0x945fE27749F564173237FdDF47749b676a14111F';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('523981', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenBong to: ${instance.address}`);
  deployments.teamTokenBong = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-aldana').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '';
  const magicGov = '';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('523981', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenAldana to: ${instance.address}`);
  deployments.teamTokenAldana = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-gaarp').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0x6422383b2c35Cb2E86957aD197D0bd126DDeD306';
  const magicGov = '0x6422383b2c35Cb2E86957aD197D0bd126DDeD306';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('4400629', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenGaarp to: ${instance.address}`);
  deployments.teamTokenGaarp = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-cheese').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0x505fB9BDcf602605Ba1BE05F9d6D272F726AC7a7';
  const magicGov = '0x505fB9BDcf602605Ba1BE05F9d6D272F726AC7a7';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('3244260', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenCheese to: ${instance.address}`);
  deployments.teamTokenCheese = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-josh').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '';
  const magicGov = '';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('582201', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenJosh to: ${instance.address}`);
  deployments.teamTokenJosh = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-tei').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0xcD42c983aF752815C1b7428c136Fb23c7f92d19F';
  const magicGov = '0xcD42c983aF752815C1b7428c136Fb23c7f92d19F';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('2312738', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenTei to: ${instance.address}`);
  deployments.teamTokenTei = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-jumpman').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0xBCC29c1D3377B674Ef2804E43817c0cE0009d262';
  const magicGov = '0xBCC29c1D3377B674Ef2804E43817c0cE0009d262';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('1156369', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenJumpman to: ${instance.address}`);
  deployments.teamTokenJumpman = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-end').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0x189d740cA01d9E88e9395436B3CdF0bFf0dD26C3';
  const magicGov = '0x189d740cA01d9E88e9395436B3CdF0bFf0dD26C3';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('1156369', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenEnd to: ${instance.address}`);
  deployments.teamTokenEnd = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});

task('deploy-otc-escrow-t1dev').setAction(async function () {
  const [deployer] = await ethers.getSigners();

  // approximately 6000 blocks per day
  const beneficiary = '0xa3d9b2912Bf838Ac9bBb58Dc8639c12250088EAE';
  const magicGov = '0xa3d9b2912Bf838Ac9bBb58Dc8639c12250088EAE';
  const vestingStart = ethers.utils.BigNumber.from('1669280461');
  const vestingCliff = etheres.utils.BigNumber.from('1669280461');
  const vestingEnd = ethers.utils.BigNumber.from('1732438861');
  const usdcAmount = ethers.utils.parseUnits('0', 18);
  const magicAmount = ethers.utils.parseUnits('2312738', 18);
  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

  const factory = await ethers.getContractFactory('OtcEscrow', deployer);
  const instance = await factory.deploy(
    beneficiary,
    magicGov,
    vestingStart,
    vestingCliff,
    vestingEnd,
    usdcAmount,
    magicAmount,
    usdcAddress,
    magicAddress,
  );

  await instance.deployed();

  console.log(`Deployed teamTokenT1dev to: ${instance.address}`);
  deployments.teamTokenT1dev = instance.address;

  const json = JSON.stringify(deployments, null, 2);
  fs.writeFileSync(`${__dirname}/../data/deployments.json`, `${json}\n`, {
    flag: 'w',
  });
});
