const items = require('../data/items');
const RATE_MULTIPLIER = ethers.utils
  .parseUnits('1', 18)
  .div(ethers.BigNumber.from('6000'));
module.exports = [
  '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A',
  '0xD0eD73b33789111807BD64aE2a6E1e6f92f986f5',
  180000,
  items.map((i) => [
    i.name,
    ethers.BigNumber.from(i.value).mul(RATE_MULTIPLIER),
  ]),
];
