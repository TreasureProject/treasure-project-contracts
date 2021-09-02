require('dotenv').config();

require('@nomiclabs/hardhat-waffle');
require('hardhat-docgen');
require('hardhat-gas-reporter');
require('hardhat-spdx-license-identifier');
require('solidity-coverage');

module.exports = {
  solidity: {
    version: '0.8.1',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    generic: {
      url: `${ process.env.NODE_URL }`,
      accounts: {
        mnemonic: `${ process.env.MNEMONIC }`,
      },
    },
  },

  docgen: {
    clear: true,
    runOnCompile: true,
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
  },

  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
};
