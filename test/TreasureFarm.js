const { expect } = require('chai');

describe('TreasureFarm', function () {
  let signer;
  let instance;

  before(async function () {
    [signer] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const factory = await ethers.getContractFactory('TreasureFarm');
    instance = await factory.deploy();
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
