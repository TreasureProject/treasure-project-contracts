const fs = require('fs');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const deployments = require('../data/deployments');
const inputs = require('../data/frozen_magic_claim_source');

async function main() {
  const { forking } = network.config;
  if (forking?.enabled !== true) throw 'fork mode must be enabled';
  if (forking?.blockNumber !== 13418455) throw 'invalid block number';

  const agldFarm = await ethers.getContractAt('AGLDFarm', deployments.agldFarm);
  const lootFarm = await ethers.getContractAt(
    'ERC721Farm',
    deployments.lootFarm,
  );
  const nFarm = await ethers.getContractAt('ERC721Farm', deployments.nFarm);
  const treasureFarm = await ethers.getContractAt(
    'TreasureFarm',
    deployments.treasureFarm,
  );

  const farmDepositors = inputs.reduce(
    function (acc, el) {
      acc[el.farm].push(el.address);
      return acc;
    },
    {
      AGLD: [],
      Loot: [],
      N: [],
      Treasure: [],
    },
  );

  const balances = {};

  const addBalance = function (address, amount) {
    address = ethers.utils.getAddress(address);
    const total = (balances[address] || ethers.constants.Zero).add(amount);
    if (!total.isZero()) balances[address] = total;
  };

  for (var address of farmDepositors.AGLD) {
    console.log('AGLD', address);
    const rewards = await agldFarm.callStatic.calculateRewards(address);
    addBalance(address, rewards);
  }

  for (var address of farmDepositors.Loot) {
    console.log('Loot', address);
    const ids = await lootFarm.callStatic.depositsOf(address);
    const rewards = await lootFarm.callStatic.calculateRewards(address, ids);
    addBalance(
      address,
      rewards.reduce((acc, el) => acc.add(el), ethers.constants.Zero),
    );
  }

  for (var address of farmDepositors.N) {
    console.log('N', address);
    const ids = await nFarm.callStatic.depositsOf(address);
    const rewards = await nFarm.callStatic.calculateRewards(address, ids);
    addBalance(
      address,
      rewards.reduce((acc, el) => acc.add(el), ethers.constants.Zero),
    );
  }

  for (var address of farmDepositors.Treasure) {
    console.log('Treasure', address);
    const { tokenIds: ids } = await treasureFarm.callStatic.depositsOf(address);
    const rewards = await treasureFarm.callStatic.calculateRewards(
      address,
      ids,
    );
    addBalance(
      address,
      rewards.reduce((acc, el) => acc.add(el), ethers.constants.Zero),
    );
  }

  const entries = Object.keys(balances).map(function (address) {
    const amount = balances[address];
    const leaf = ethers.utils.solidityKeccak256(
      ['address', 'uint256'],
      [address, amount],
    );

    return {
      address,
      amount: amount.toString(),
      leaf,
    };
  });

  const tree = new MerkleTree(
    entries.map((el) => el.leaf),
    keccak256,
    {
      hashLeaves: false,
      sortPairs: true,
    },
  );

  entries.forEach(function (entry) {
    entry.proof = tree.getHexProof(entry.leaf);
  });

  const output = {
    entries,
    root: tree.getHexRoot(),
  };

  fs.writeFileSync(
    `${__dirname}/../data/frozen_magic_claim_tree.json`,
    `${JSON.stringify(output, null, 2)}\n`,
    {
      flag: 'w',
    },
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
