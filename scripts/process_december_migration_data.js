const fs = require('fs');

const items = require('../data/items.json');
const inputs721 = require('../data/december_migration/721.json');
const inputs1155 = require('../data/december_migration/1155.json');
const collections = require('../data/cards_collections.json');

const getItemNames = async function (treasure, tokenId) {
  return [
    await treasure.callStatic.getAsset1(tokenId),
    await treasure.callStatic.getAsset2(tokenId),
    await treasure.callStatic.getAsset3(tokenId),
    await treasure.callStatic.getAsset4(tokenId),
    await treasure.callStatic.getAsset5(tokenId),
    await treasure.callStatic.getAsset6(tokenId),
    await treasure.callStatic.getAsset7(tokenId),
    await treasure.callStatic.getAsset8(tokenId),
  ];
};

const getItemId = function (name) {
  return ethers.BigNumber.from(
    ethers.utils.solidityKeccak256(['string'], [name]),
  );
};

async function main() {
  if (network.name != 'hardhat') throw 'wrong network';

  const f = await ethers.getContractFactory('Treasure');
  const treasure = await f.deploy();
  await treasure.deployed();

  const nameToId = {};
  const idToName = {};
  items.forEach((i) => (nameToId[i.name] = getItemId(i.name)));

  for (var name in nameToId) {
    if (nameToId.hasOwnProperty(name)) {
      idToName[nameToId[name]] = name;
    }
  }

  const held = {};

  for (const { address, id } of inputs721) {
    const names = await getItemNames(treasure, id);

    for (const name of names) {
      if (!held[address]) held[address] = {};
      if (!held[address][name]) held[address][name] = 0;

      held[address][name]++;
    }
  }

  for (const { address, id, amount } of inputs1155) {
    const name = idToName[id];
    if (!held[address]) held[address] = {};
    if (!held[address][name]) held[address][name] = 0;

    held[address][name] += parseInt(amount);
  }

  const output = [];

  const nameReplacements = {
    Carrage: 'Carriage',
    'Red FeatherSnow White Feather': 'Red Feather',
    'Red and White Feather': 'Red Feather',
    'Silver Penny': 'Silver Coin',
  };

  for (const address in held) {
    for (const name in held[address]) {
      output.push({
        address,
        name: nameReplacements[name] || name,
        amount: held[address][name].toString(),
      });
    }
  }

  const nameToL2Id = {};

  for (const { name, tokenId } of collections) {
    nameToL2Id[name] = tokenId;
  }

  for (const out of output) {
    out.id = nameToL2Id[out.name];
  }

  fs.writeFileSync(
    `${__dirname}/../data/december_migration/source.json`,
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
