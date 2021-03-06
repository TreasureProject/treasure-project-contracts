const { expect } = require('chai');

const items = require('../data/items');

// approximately 6000 blocks per day
const RATE_MULTIPLIER = ethers.utils
  .parseUnits('1', 18)
  .div(ethers.BigNumber.from('6000'));

const EXPIRATION = ethers.BigNumber.from('15');

describe('TreasureFarm', function () {
  let signer;

  let magic;
  let treasure;
  let treasureUnraveler;
  let instance;

  let deploymentBlock;

  let tokenId;
  let itemNames;
  let itemIds;
  let itemValues;

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

  const mineBlocks = async function (number) {
    for (let i = 0; i < number; i++) {
      await ethers.provider.send('evm_mine', []);
    }
  };

  before(async function () {
    [signer] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const magicFactory = await ethers.getContractFactory('MagicProxy');
    magic = await magicFactory.deploy();
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

    magic = await ethers.getContractAt('Magic', magic.address);

    const treasureFactory = await ethers.getContractFactory('Treasure');
    treasure = await treasureFactory.deploy();
    await treasure.deployed();

    const treasureUnravelerFactory = await ethers.getContractFactory(
      'TreasureUnraveler',
    );
    treasureUnraveler = await treasureUnravelerFactory.deploy(
      treasure.address,
      items.map((i) => i.name),
    );
    await treasureUnraveler.deployed();

    const factory = await ethers.getContractFactory('TreasureFarm');
    instance = await factory.deploy(
      magic.address,
      treasureUnraveler.address,
      EXPIRATION,
      items.map((i) => [
        i.name,
        ethers.BigNumber.from(i.value).mul(RATE_MULTIPLIER),
      ]),
    );
    const deployTx = await instance.deployed();
    const { blockNumber } = await deployTx.deployTransaction.wait();
    deploymentBlock = blockNumber;

    await magic.connect(signer).setWhitelist([instance.address]);

    tokenId = ethers.constants.One;

    await treasure.connect(signer).claim(tokenId);
    await treasure
      .connect(signer)
      .setApprovalForAll(treasureUnraveler.address, true);
    await treasureUnraveler.connect(signer).unravel(tokenId);
    await treasureUnraveler
      .connect(signer)
      .setApprovalForAll(instance.address, true);

    itemNames = await getItemNames(tokenId);
    itemIds = itemNames.map(getItemId);
    itemValues = itemNames.map(getItemValuePerBlock);
  });

  describe('#depositsOf', function () {
    it('returns list of deposited token ids and list of amountsfor given user', async function () {
      const [itemId] = itemIds;

      let [tokenIds, amounts] = await instance.callStatic.depositsOf(
        signer.address,
      );

      expect(tokenIds).to.deep.have.members([]);

      expect(amounts).to.deep.have.members([]);

      await instance.connect(signer).deposit([itemId], [ethers.constants.One]);

      [tokenIds, amounts] = await instance.callStatic.depositsOf(
        signer.address,
      );

      expect(tokenIds).to.deep.have.members([itemId]);

      expect(amounts).to.deep.have.members([ethers.constants.One]);

      await instance.connect(signer).withdraw([itemId], [ethers.constants.One]);

      [tokenIds, amounts] = await instance.callStatic.depositsOf(
        signer.address,
      );

      expect(tokenIds).to.deep.have.members([]);

      expect(amounts).to.deep.have.members([]);
    });
  });

  describe('#calculateRewards', function () {
    it('returns pending rewards for given user and token', async function () {
      const [itemId] = itemIds;
      const [itemValue] = itemValues;

      expect(
        await instance.callStatic.calculateRewards(signer.address, [itemId]),
      ).to.deep.have.members([ethers.constants.Zero]);

      const tx = await instance
        .connect(signer)
        .deposit([itemId], [ethers.constants.One]);
      const { blockNumber } = await tx.wait();

      await mineBlocks(7);

      expect(
        await instance.callStatic.calculateRewards(signer.address, [itemId]),
      ).to.deep.have.members([itemValue.mul(ethers.BigNumber.from('7'))]);

      await mineBlocks(10);

      expect(
        await instance.callStatic.calculateRewards(signer.address, [itemId]),
      ).to.deep.have.members([
        itemValue.mul(
          EXPIRATION.sub(
            ethers.BigNumber.from((blockNumber - deploymentBlock).toString()),
          ),
        ),
      ]);
    });
  });

  describe('#claimRewards', function () {
    it('transfers pending rewards to sender', async function () {
      const [itemId] = itemIds;
      const [itemValue] = itemValues;

      await instance.connect(signer).deposit([itemId], [ethers.constants.One]);

      await mineBlocks(7);

      const expected = (
        await instance.callStatic.calculateRewards(signer.address, [itemId])
      )
        .reduce((acc, r) => acc.add(r), ethers.constants.Zero)
        .add(itemValue);

      await expect(() =>
        instance.connect(signer).claimRewards([itemId]),
      ).to.changeTokenBalance(magic, signer, expected);
    });

    it('resets pending rewards to zero', async function () {
      const [itemId] = itemIds;

      await instance.connect(signer).deposit([itemId], [ethers.constants.One]);

      await mineBlocks(1);

      expect(
        (
          await instance.callStatic.calculateRewards(signer.address, [itemId])
        ).reduce((acc, r) => acc.add(r), ethers.constants.Zero),
      ).not.to.equal(ethers.constants.Zero);
      await instance.connect(signer).claimRewards([itemId]);
      expect(
        (
          await instance.callStatic.calculateRewards(signer.address, [itemId])
        ).reduce((acc, r) => acc.add(r), ethers.constants.Zero),
      ).to.equal(ethers.constants.Zero);
    });
  });

  describe('#deposit', function () {
    it('transfers token from sender to contract', async function () {
      const [itemId] = itemIds;

      const oldFarmBalance = await treasureUnraveler.callStatic.balanceOf(
        instance.address,
        itemId,
      );
      const oldUserBalance = await treasureUnraveler.callStatic.balanceOf(
        signer.address,
        itemId,
      );

      await instance.connect(signer).deposit([itemId], [ethers.constants.One]);

      const newFarmBalance = await treasureUnraveler.callStatic.balanceOf(
        instance.address,
        itemId,
      );
      const newUserBalance = await treasureUnraveler.callStatic.balanceOf(
        signer.address,
        itemId,
      );

      expect(newFarmBalance).to.equal(oldFarmBalance.add(ethers.constants.One));
      expect(newUserBalance).to.equal(oldUserBalance.sub(ethers.constants.One));
    });

    it('transfers pending rewards to sender', async function () {
      const [itemId] = itemIds;
      const [itemValue] = itemValues;

      await instance.connect(signer).deposit([itemId], [ethers.constants.One]);

      await mineBlocks(7);

      const expected = (
        await instance.callStatic.calculateRewards(signer.address, [itemId])
      )
        .reduce((acc, r) => acc.add(r), ethers.constants.Zero)
        .add(itemValue);

      await expect(() =>
        instance.connect(signer).deposit([itemId], [ethers.constants.Zero]),
      ).to.changeTokenBalance(magic, signer, expected);
    });

    describe('reverts if', function () {
      it('deposit amount exceeds balance', async function () {
        const [itemId] = itemIds;

        await expect(
          instance
            .connect(signer)
            .deposit([itemId], [ethers.BigNumber.from('10')]),
        ).to.be.revertedWith('ERC1155: insufficient balance for transfer');
      });

      it('contract is not approved for transfer', async function () {
        const [itemId] = itemIds;

        await treasureUnraveler
          .connect(signer)
          .setApprovalForAll(instance.address, false);

        await expect(
          instance
            .connect(signer)
            .deposit([itemId], [ethers.BigNumber.from('10')]),
        ).to.be.revertedWith('ERC1155: caller is not owner nor approved');
      });
    });
  });

  describe('#withdraw', function () {
    it('transfers token from contract to sender', async function () {
      const [itemId] = itemIds;

      await instance.connect(signer).deposit([itemId], [ethers.constants.One]);

      const oldFarmBalance = await treasureUnraveler.callStatic.balanceOf(
        instance.address,
        itemId,
      );
      const oldUserBalance = await treasureUnraveler.callStatic.balanceOf(
        signer.address,
        itemId,
      );

      await instance.connect(signer).withdraw([itemId], [ethers.constants.One]);

      const newFarmBalance = await treasureUnraveler.callStatic.balanceOf(
        instance.address,
        itemId,
      );
      const newUserBalance = await treasureUnraveler.callStatic.balanceOf(
        signer.address,
        itemId,
      );

      expect(newFarmBalance).to.equal(oldFarmBalance.sub(ethers.constants.One));
      expect(newUserBalance).to.equal(oldUserBalance.add(ethers.constants.One));
    });

    it('transfers pending rewards to sender', async function () {
      const [itemId] = itemIds;
      const [itemValue] = itemValues;

      await instance.connect(signer).deposit([itemId], [ethers.constants.One]);

      await mineBlocks(7);

      const expected = (
        await instance.callStatic.calculateRewards(signer.address, [itemId])
      )
        .reduce((acc, r) => acc.add(r), ethers.constants.Zero)
        .add(itemValue);

      await expect(() =>
        instance.connect(signer).withdraw([itemId], [ethers.constants.One]),
      ).to.changeTokenBalance(magic, signer, expected);
    });

    describe('reverts if', function () {
      it('withdrawal amount exceeds deposited balance', async function () {
        const [itemId] = itemIds;

        await expect(
          instance.connect(signer).withdraw([itemId], [ethers.constants.One]),
        ).to.be.revertedWith('TreasureFarm: insufficient balance');

        await instance
          .connect(signer)
          .deposit([itemId], [ethers.constants.One]);

        await expect(
          instance.connect(signer).withdraw([itemId], [ethers.constants.Two]),
        ).to.be.revertedWith('TreasureFarm: insufficient balance');
      });
    });
  });
});
