const fs = require('fs');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const source = require('../data/cards_claim_source_2');

async function main() {
  const reduction = source.reduce(function (acc, { address, id, amount }) {
    const identifier = `${ethers.utils.getAddress(address)},${id}`;
    if (!acc[identifier]) acc[identifier] = 0;
    acc[identifier] += parseInt(amount);
    return acc;
  }, {});

  const inputs = [];

  for (var identifier in reduction) {
    const [address, id] = identifier.split(',');
    const amount = reduction[identifier].toString();
    inputs.push({ address, id, amount });
  }

  const leaves = inputs.map(function (entry) {
    const address = entry.address;
    const id = ethers.BigNumber.from(entry.id);
    const amount = ethers.BigNumber.from(entry.amount);
    const leaf = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256'],
      [address, id, amount],
    );

    entry.leaf = leaf;

    return leaf;
  });

  const tree = new MerkleTree(leaves, keccak256, {
    hashLeaves: false,
    sortPairs: true,
  });

  inputs.forEach(function (entry) {
    entry.proof = tree.getHexProof(entry.leaf);
  });

  const output = {
    entries: inputs,
  };

  output.root = tree.getHexRoot();

  fs.writeFileSync(
    `${__dirname}/../data/cards_claim_tree_2.json`,
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
