const { expect } = require('chai');

const items = require('../data/items');

// approximately 6000 blocks per day
const RATE_MULTIPLIER = ethers.utils
  .parseUnits('1', 18)
  .div(ethers.BigNumber.from('6000'));

describe('TreasureFarm', function () {
  let signer;

  let treasure;
  let treasureFractionalizer;
  let instance;

  const getItemNames = async function (tokenId) {
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

  const getItemValuePerBlock = function (name) {
    return ethers.BigNumber.from(items.find((i) => i.name === name).value).mul(
      RATE_MULTIPLIER,
    );
  };

  before(async function () {
    [signer] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const treasureFactory = await ethers.getContractFactory('Treasure');
    treasure = await treasureFactory.deploy();
    await treasure.deployed();

    const treasureFractionalizerFactory = await ethers.getContractFactory(
      'TreasureFractionalizer',
    );
    treasureFractionalizer = await treasureFractionalizerFactory.deploy(
      treasure.address,
      items.map((i) => i.name),
    );
    await treasureFractionalizer.deployed();

    const factory = await ethers.getContractFactory('TreasureFarm');
    instance = await factory.deploy(
      treasureFractionalizer.address,
      items.map((i) => [
        i.name,
        ethers.BigNumber.from(i.value).mul(RATE_MULTIPLIER),
      ]),
    );
    await instance.deployed();
  });

  describe('#calculateReward', function () {
    it('returns pending rewards for given user and token', async function () {
      const tokenId = ethers.constants.One;

      await treasure.connect(signer).claim(tokenId);
      await treasure
        .connect(signer)
        .setApprovalForAll(treasureFractionalizer.address, true);
      await treasureFractionalizer.connect(signer).fractionalize(tokenId);
      await treasureFractionalizer
        .connect(signer)
        .setApprovalForAll(instance.address, true);

      const itemNames = await getItemNames(tokenId);
      const itemIds = itemNames.map(getItemId);
      const itemValues = itemNames.map(getItemValuePerBlock);

      const depositTx = await instance
        .connect(signer)
        .deposit(itemIds[0], ethers.constants.One);

      const blocks = ethers.BigNumber.from('7');

      for (let i = 0; i < blocks.toNumber(); i++) {
        await ethers.provider.send('evm_mine', []);
      }

      expect(
        await instance.callStatic.calculateReward(signer.address, tokenId),
      ).to.equal(itemValues[0].mul(blocks));

      // await expect(
      //   () => instance.connect(signer).claimReward(tokenId)
      // ).to.changeTokenBalance(
      //   instance,
      //   signer,
      //   expected
      // );
    });
  });

  describe('#claimReward', function () {
    it('transfers pending rewards to sender');
  });

  describe('#deposit', function () {
    it('todo');

    it('claims pending rewards');

    describe('reverts if', function () {
      it('todo');
    });
  });

  describe('#withdraw', function () {
    it('todo');

    it('claims pending rewards');

    describe('reverts if', function () {
      it('todo');
    });
  });
});
