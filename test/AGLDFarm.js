const { expect } = require('chai');

// approximately 6000 blocks per day
const RATE = ethers.utils
  .parseUnits('0.1', 18)
  .div(ethers.BigNumber.from('6000'));

describe('AGLDFarm', function () {
  let signer;

  let agld;
  let magic;
  let instance;

  const mineBlocks = async function (number) {
    for (let i = 0; i < number; i++) {
      await ethers.provider.send('evm_mine', []);
    }
  };

  before(async function () {
    [signer] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const agldFactory = await ethers.getContractFactory('ERC20Mock');
    agld = await agldFactory.deploy();
    await agld.deployed();

    const magicFactory = await ethers.getContractFactory('Magic');
    magic = await magicFactory.deploy();
    await magic.deployed();

    const factory = await ethers.getContractFactory('AGLDFarm');
    instance = await factory.deploy(magic.address, agld.address, RATE);
    await instance.deployed();

    await magic.connect(signer).setWhitelist([instance.address]);

    await agld
      .connect(signer)
      .mint(signer.address, ethers.constants.MaxUint256);
    await agld
      .connect(signer)
      .approve(instance.address, ethers.constants.MaxUint256);
  });

  describe('#calculateReward', function () {
    it('returns pending rewards for given user and token', async function () {
      expect(
        await instance.callStatic.calculateReward(signer.address),
      ).to.equal(ethers.constants.Zero);

      await instance.connect(signer).deposit(ethers.constants.One);

      await mineBlocks(7);

      expect(
        await instance.callStatic.calculateReward(signer.address),
      ).to.equal(RATE.mul(ethers.BigNumber.from('7')));
    });
  });

  describe('#claimReward', function () {
    it('transfers pending rewards to sender', async function () {
      await instance.connect(signer).deposit(ethers.constants.One);

      await mineBlocks(7);

      const expected = (
        await instance.callStatic.calculateReward(signer.address)
      ).add(RATE);

      await expect(() =>
        instance.connect(signer).claimReward(),
      ).to.changeTokenBalance(magic, signer, expected);
    });

    it('resets pending rewards to zero', async function () {
      await instance.connect(signer).deposit(ethers.constants.One);

      await mineBlocks(1);

      expect(
        await instance.callStatic.calculateReward(signer.address),
      ).not.to.equal(ethers.constants.Zero);
      await instance.connect(signer).claimReward();
      expect(
        await instance.callStatic.calculateReward(signer.address),
      ).to.equal(ethers.constants.Zero);
    });
  });

  describe('#deposit', function () {
    it('transfers tokens from sender to contract', async function () {
      await expect(() =>
        instance.connect(signer).deposit(ethers.constants.One),
      ).to.changeTokenBalances(
        agld,
        [signer, instance],
        [ethers.constants.NegativeOne, ethers.constants.One],
      );
    });

    it('claims pending rewards', async function () {
      await instance.connect(signer).deposit(ethers.constants.One);

      await mineBlocks(7);

      const expected = (
        await instance.callStatic.calculateReward(signer.address)
      ).add(RATE);

      await expect(() =>
        instance.connect(signer).deposit(ethers.constants.Zero),
      ).to.changeTokenBalance(magic, signer, expected);
    });

    describe('reverts if', function () {
      it('deposit amount exceeds balance', async function () {
        await agld
          .connect(signer)
          .transfer(agld.address, ethers.constants.MaxUint256);

        await expect(
          instance.connect(signer).deposit(ethers.constants.One),
        ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
      });

      it('contract is not approved for transfer', async function () {
        await agld
          .connect(signer)
          .approve(instance.address, ethers.constants.Zero);

        await expect(
          instance.connect(signer).deposit(ethers.constants.One),
        ).to.be.revertedWith('ERC20: transfer amount exceeds allowance');
      });
    });
  });

  describe('#withdraw', function () {
    it('transfers token from contract to sender', async function () {
      await instance.connect(signer).deposit(ethers.constants.One);

      await expect(() =>
        instance.connect(signer).withdraw(ethers.constants.One),
      ).to.changeTokenBalances(
        agld,
        [signer, instance],
        [ethers.constants.One, ethers.constants.NegativeOne],
      );
    });

    it('claims pending rewards', async function () {
      it('transfers pending rewards to sender', async function () {
        await instance.connect(signer).deposit(ethers.constants.One);

        await mineBlocks(7);

        const expected = (
          await instance.callStatic.calculateReward(signer.address)
        ).add(RATE);

        await expect(() =>
          instance.connect(signer).withdraw(ethers.constants.One),
        ).to.changeTokenBalance(magic, signer, expected);
      });
    });

    describe('reverts if', function () {
      it('withdrawal amount exceeds deposited balance', async function () {
        await expect(
          instance.connect(signer).withdraw(ethers.constants.One),
        ).to.be.revertedWith('AGLDFarm: insufficient balance');

        await instance.connect(signer).deposit(ethers.constants.One);

        await expect(
          instance.connect(signer).withdraw(ethers.constants.Two),
        ).to.be.revertedWith('AGLDFarm: insufficient balance');
      });
    });
  });
});
