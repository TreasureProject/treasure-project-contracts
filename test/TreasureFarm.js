const { expect } = require('chai');

const items = require('../data/items');

// approximately 6000 blocks per day
const RATE_MULTIPLIER = ethers.utils
  .parseUnits('1', 18)
  .div(ethers.BigNumber.from('6000'));

describe('TreasureFarm', function () {
  let signer;
  let instance;

  before(async function () {
    [signer] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const treasureFactory = await ethers.getContractFactory('Treasure');
    let treasure = await treasureFactory.deploy();
    await treasure.deployed();

    const treasureFractionalizerFactory = await ethers.getContractFactory(
      'TreasureFractionalizer',
    );
    let treasureFractionalizer = await treasureFractionalizerFactory.deploy(
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
    it('returns pending rewards for given user and token');
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
