const { expect } = require('chai');

// approximately 6000 blocks per day
const RATE = ethers.utils
  .parseUnits('1', 18)
  .div(ethers.BigNumber.from('6000'));

describe('Magic', function () {
  let signer;
  let nobody;

  let agld;
  let magic;
  let instance;

  const mineBlocks = async function (number) {
    for (let i = 0; i < number; i++) {
      await ethers.provider.send('evm_mine', []);
    }
  };

  before(async function () {
    [signer, nobody] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const factory = await ethers.getContractFactory('Magic');
    instance = await factory.deploy();
    await instance.deployed();
  });

  describe('#setWhitelist', function () {
    it('enables passed addresses to mint tokens', async function () {
      await expect(
        instance.connect(nobody).mint(nobody.address, ethers.constants.One),
      ).to.be.revertedWith('Magic: sender must be whitelisted');

      await instance.connect(signer).setWhitelist([nobody.address]);

      await expect(
        instance.connect(nobody).mint(nobody.address, ethers.constants.One),
      ).not.to.be.reverted;
    });

    describe('reverts if', function () {
      it('sender is not deployer', async function () {
        await expect(
          instance.connect(nobody).setWhitelist([]),
        ).to.be.revertedWith('Magic: sender must be owner');
      });

      it('function has already been called', async function () {
        await instance.connect(signer).setWhitelist([]);

        await expect(
          instance.connect(signer).setWhitelist([]),
        ).to.be.revertedWith('Magic: sender must be owner');
      });
    });
  });

  describe('#mint', function () {
    it('mints given quantity of tokens for given account', async function () {
      await instance.connect(signer).setWhitelist([signer.address]);

      await expect(() =>
        instance.connect(signer).mint(nobody.address, ethers.constants.One),
      ).to.changeTokenBalance(instance, nobody, ethers.constants.One);
    });

    describe('reverts if', function () {
      it('sender is not whitelisted', async function () {
        await expect(
          instance.connect(nobody).mint(nobody.address, ethers.constants.One),
        ).to.be.revertedWith('Magic: sender must be whitelisted');
      });
    });
  });
});
