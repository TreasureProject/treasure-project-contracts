const { expect } = require('chai');

const items = require('../data/items');

describe('TreasureFractionalizer', function () {
  let signer;

  let treasure;
  let instance;

  let tokenId;
  let itemNames;
  let itemIds;

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

  before(async function () {
    [signer] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const treasureFactory = await ethers.getContractFactory('Treasure');
    treasure = await treasureFactory.deploy();
    await treasure.deployed();

    const factory = await ethers.getContractFactory('TreasureFractionalizer');
    instance = await factory.deploy(
      treasure.address,
      items.map((i) => i.name),
    );
    await instance.deployed();

    tokenId = ethers.constants.One;

    await treasure.connect(signer).claim(tokenId);
    await treasure.connect(signer).setApprovalForAll(instance.address, true);

    itemNames = await getItemNames(tokenId);
    itemIds = itemNames.map(getItemId);
  });

  describe('#uri', function () {
    it('generates encoded JSON with embedded SVG', async function () {
      for (let itemName of itemNames) {
        const itemId = getItemId(itemName);

        const uri = await instance.callStatic.uri(itemId);

        const [, jsonBase64] = uri.split(',');
        const json = JSON.parse(
          Buffer.from(jsonBase64, 'base64').toString('utf8'),
        );

        const [, svgBase64] = json.image.split(',');
        const svg = Buffer.from(svgBase64, 'base64').toString('utf8');

        expect(svg.includes(itemName)).to.be.true;
      }
    });
  });

  describe('#fractionalize', function () {
    it('transfers Treasure ERC721 token from sender to contract', async function () {
      expect(await treasure.callStatic.ownerOf(tokenId)).to.equal(
        signer.address,
      );

      await expect(() =>
        instance.connect(signer).fractionalize(tokenId),
      ).to.changeTokenBalances(
        treasure,
        [signer, instance],
        [ethers.constants.NegativeOne, ethers.constants.One],
      );

      expect(await treasure.callStatic.ownerOf(tokenId)).to.equal(
        instance.address,
      );
    });

    it('mints Treasure ERC1155 tokens for sender', async function () {
      for (let itemId of itemIds) {
        expect(
          await instance.callStatic.balanceOf(signer.address, itemId),
        ).to.equal(ethers.constants.Zero);
      }

      await instance.connect(signer).fractionalize(tokenId);

      for (let itemId of itemIds) {
        expect(
          await instance.callStatic.balanceOf(signer.address, itemId),
        ).to.equal(ethers.constants.One);
      }
    });

    it('corrects for Treasure spelling errors', async function () {
      const errTokenId1 = ethers.BigNumber.from('4');
      await treasure.connect(signer).claim(errTokenId1);
      await instance.connect(signer).fractionalize(errTokenId1);

      const errTokenId2 = ethers.BigNumber.from('10');
      await treasure.connect(signer).claim(errTokenId2);
      await instance.connect(signer).fractionalize(errTokenId2);

      expect(
        await instance.callStatic.balanceOf(
          signer.address,
          getItemId('Red FeatherSnow White Feather'),
        ),
      ).to.equal(ethers.constants.Zero);
      expect(
        await instance.callStatic.balanceOf(
          signer.address,
          getItemId('Red and White Feather'),
        ),
      ).to.equal(ethers.constants.One);

      expect(
        await instance.callStatic.balanceOf(
          signer.address,
          getItemId('Carrage'),
        ),
      ).to.equal(ethers.constants.Zero);
      expect(
        await instance.callStatic.balanceOf(
          signer.address,
          getItemId('Carriage'),
        ),
      ).to.equal(ethers.constants.One);
    });

    describe('reverts if', function () {
      it('sender is not owner of given token id', async function () {
        await treasure
          .connect(signer)
          .transferFrom(signer.address, instance.address, tokenId);

        await expect(
          instance.connect(signer).fractionalize(tokenId),
        ).to.be.revertedWith('ERC721: transfer of token that is not own');
      });

      it('contract is not approved for transfer', async function () {
        await treasure
          .connect(signer)
          .setApprovalForAll(instance.address, false);

        await expect(
          instance.connect(signer).fractionalize(tokenId),
        ).to.be.revertedWith(
          'ERC721: transfer caller is not owner nor approved',
        );
      });
    });
  });
});
