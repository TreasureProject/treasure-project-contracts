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
    const magicFactory = await ethers.getContractFactory('MagicProxy');
    const magic = await magicFactory.deploy();
    await magic.deployed();

    const magicImplementationFactory = await ethers.getContractFactory('Magic');
    const magicImplementation = await magicImplementationFactory.deploy();
    await magicImplementation.deployed();

    const facetCuts = [
      {
        target: magicImplementation.address,
        action: 0,
        selectors: Object.keys(magicImplementation.interface.functions).map(
          (fn) => magicImplementation.interface.getSighash(fn),
        ),
      },
    ];

    await magic
      .connect(signer)
      .diamondCut(facetCuts, ethers.constants.AddressZero, '0x');

    instance = await ethers.getContractAt('Magic', magic.address);
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
      it('sender is not owner', async function () {
        await expect(
          instance.connect(nobody).setWhitelist([]),
        ).to.be.revertedWith('Ownable: sender must be owner');
      });

      it('function has already been called', async function () {
        await instance.connect(signer).setWhitelist([]);

        await expect(
          instance.connect(signer).setWhitelist([]),
        ).to.be.revertedWith('Magic: whitelist already set');
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

  describe('#teamMint', function () {
    it('mints given quantity of tokens for given account', async function () {
      await instance.connect(signer).setWhitelist([signer.address]);

      await instance
        .connect(signer)
        .mint(nobody.address, ethers.BigNumber.from('10'));

      await expect(() =>
        instance.connect(signer).teamMint(nobody.address, ethers.constants.One),
      ).to.changeTokenBalance(instance, nobody, ethers.constants.One);
    });

    describe('reverts if', function () {
      it('sender is not owner', async function () {
        await expect(
          instance
            .connect(nobody)
            .teamMint(nobody.address, ethers.constants.One),
        ).to.be.revertedWith('Ownable: sender must be owner');
      });

      it('total team mint amount exceeds 10% of supply', async function () {
        await instance.connect(signer).setWhitelist([signer.address]);

        await instance
          .connect(signer)
          .mint(nobody.address, ethers.BigNumber.from('8'));

        await expect(
          instance
            .connect(signer)
            .teamMint(nobody.address, ethers.constants.One),
        ).to.be.revertedWith('Magic: excessive mint');

        await instance
          .connect(signer)
          .mint(nobody.address, ethers.constants.One);

        // total supply has changed, minting is enabled

        await expect(
          instance
            .connect(signer)
            .teamMint(nobody.address, ethers.constants.One),
        ).not.to.be.reverted;

        // team mint amount has increased, minting is disabled

        await expect(
          instance
            .connect(signer)
            .teamMint(nobody.address, ethers.constants.One),
        ).to.be.revertedWith('Magic: excessive mint');
      });
    });
  });
});
