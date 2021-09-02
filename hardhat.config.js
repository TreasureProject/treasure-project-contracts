require('dotenv').config();

require('@nomiclabs/hardhat-waffle');
require('hardhat-docgen');
require('hardhat-gas-reporter');
require('hardhat-spdx-license-identifier');
require('solidity-coverage');

module.exports = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ process.env.ALCHEMY_KEY }`,
      accounts: [process.env.ETH_MAIN_KEY],
    },

    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ process.env.ALCHEMY_KEY }`,
      accounts: [process.env.ETH_TEST_KEY],
    },
  },

  docgen: {
    clear: true,
    runOnCompile: true,
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
  },

  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
};
