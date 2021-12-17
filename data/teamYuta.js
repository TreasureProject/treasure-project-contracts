const beneficiary = '0x52D81c84845f25dC2f481243dB8e6176A0FCB338';
const magicGov = '0x2DECe335A7Ff8FABD52a6dB5539A7A982B75351F';
const vestingStart = ethers.BigNumber.from('1669280461');
const vestingCliff = ethers.BigNumber.from('1669280461');
const vestingEnd = ethers.BigNumber.from('1732438861');
const usdcAmount = ethers.utils.parseUnits('0', 18);
const magicAmount = ethers.utils.parseUnits('7827582', 18);
const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const magicAddress = '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A';

module.exports = [
  beneficiary,
  magicGov,
  vestingStart,
  vestingCliff,
  vestingEnd,
  usdcAmount,
  magicAmount,
  usdcAddress,
  magicAddress,
];
