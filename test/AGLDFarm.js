const { expect } = require('chai');

// approximately 6000 blocks per day
const RATE = ethers.utils
  .parseUnits('0.1', 18)
  .div(ethers.BigNumber.from('6000'));

const EXPIRATION = ethers.BigNumber.from('15');

describe('AGLDFarm', function () {
  let signer;

  let agld;
  let magic;
  let instance;

  let deploymentBlock;

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
    instance = await factory.deploy(
      magic.address,
      agld.address,
      RATE,
      EXPIRATION,
    );
    const deployTx = await instance.deployed();
    const { blockNumber } = await deployTx.deployTransaction.wait();
    deploymentBlock = blockNumber;

    await magic.connect(signer).setWhitelist([instance.address]);

    await agld
      .connect(signer)
      .mint(signer.address, ethers.constants.MaxUint256);
    await agld
      .connect(signer)
      .approve(instance.address, ethers.constants.MaxUint256);
  });

  describe('#calculateRewards', function () {
    it('returns pending rewards for given user and token', async function () {
      expect(
        await instance.callStatic.calculateRewards(signer.address),
      ).to.equal(ethers.constants.Zero);

      const tx = await instance
        .connect(signer)
        .deposit(ethers.utils.parseUnits('1', 18));
      const { blockNumber } = await tx.wait();

      await mineBlocks(7);

      expect(
        await instance.callStatic.calculateRewards(signer.address),
      ).to.equal(RATE.mul(ethers.BigNumber.from('7')));

      await mineBlocks(10);

      expect(
        await instance.callStatic.calculateRewards(signer.address),
      ).to.equal(
        RATE.mul(
          EXPIRATION.sub(
            ethers.BigNumber.from((blockNumber - deploymentBlock).toString()),
          ),
        ),
      );
    });
  });

  describe('#claimRewards', function () {
    it('transfers pending rewards to sender', async function () {
      await instance.connect(signer).deposit(ethers.utils.parseUnits('1', 18));

      await mineBlocks(7);

      const expected = (
        await instance.callStatic.calculateRewards(signer.address)
      ).add(RATE);

      await expect(() =>
        instance.connect(signer).claimRewards(),
      ).to.changeTokenBalance(magic, signer, expected);
    });

    it('resets pending rewards to zero', async function () {
      await instance.connect(signer).deposit(ethers.utils.parseUnits('1', 18));

      await mineBlocks(1);

      expect(
        await instance.callStatic.calculateRewards(signer.address),
      ).not.to.equal(ethers.constants.Zero);
      await instance.connect(signer).claimRewards();
      expect(
        await instance.callStatic.calculateRewards(signer.address),
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

    it('transfers pending rewards to sender', async function () {
      await instance.connect(signer).deposit(ethers.utils.parseUnits('1', 18));

      await mineBlocks(7);

      const expected = (
        await instance.callStatic.calculateRewards(signer.address)
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
          instance.connect(signer).deposit(ethers.utils.parseUnits('1', 18)),
        ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
      });

      it('contract is not approved for transfer', async function () {
        await agld
          .connect(signer)
          .approve(instance.address, ethers.constants.Zero);

        await expect(
          instance.connect(signer).deposit(ethers.utils.parseUnits('1', 18)),
        ).to.be.revertedWith('ERC20: transfer amount exceeds allowance');
      });

      it('total deposits exceed 50 million', async function () {
        await expect(
          instance
            .connect(signer)
            .deposit(ethers.utils.parseUnits('50000000', 18)),
        ).not.to.be.reverted;

        await expect(
          instance.connect(signer).deposit(ethers.constants.One),
        ).to.be.revertedWith('AGLDFarm: deposit cap reached');
      });
    });
  });

  describe('#withdraw', function () {
    it('transfers token from contract to sender', async function () {
      await instance.connect(signer).deposit(ethers.utils.parseUnits('1', 18));

      await expect(() =>
        instance.connect(signer).withdraw(ethers.constants.One),
      ).to.changeTokenBalances(
        agld,
        [signer, instance],
        [ethers.constants.One, ethers.constants.NegativeOne],
      );
    });

    it('transfers pending rewards to sender', async function () {
      await instance.connect(signer).deposit(ethers.utils.parseUnits('1', 18));

      await mineBlocks(7);

      const expected = (
        await instance.callStatic.calculateRewards(signer.address)
      ).add(RATE);

      await expect(() =>
        instance.connect(signer).withdraw(ethers.constants.One),
      ).to.changeTokenBalance(magic, signer, expected);
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
