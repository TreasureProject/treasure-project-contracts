require('dotenv').config();

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-abi-exporter');
require('hardhat-docgen');
require('hardhat-gas-reporter');
require('hardhat-spdx-license-identifier');
require('solidity-coverage');

require('./tasks/deploy');
require('./tasks/deploy_unraveler');
require('./tasks/deploy_magic');
require('./tasks/deploy_agld_farm');
require('./tasks/deploy_loot_farm');
require('./tasks/deploy_n_farm');
require('./tasks/deploy_treasure_farm');
require('./tasks/claim');
require('./tasks/unravel');
require('./tasks/read');
require('./tasks/magic_set_whitelist');
require('./tasks/magic_fix_decimals');
require('./tasks/magic_fix_whitelist');
require('./tasks/test_mint');
require('./tasks/add_whitelist');
require('./tasks/deploy_magic_rewards');

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
    hardhat: {
      ...(process.env.FORK_MODE
        ? {
            forking: {
              url: `https://eth-${
                process.env.FORK_NETWORK || 'mainnet'
              }.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
            },
          }
        : {}),
    },

    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.ETH_MAIN_KEY],
      gas: 'auto',
      gasPrice: 'auto',
    },

    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.ETH_TEST_KEY],
    },
  },

  abiExporter: {
    clear: true,
    flat: true,
    pretty: true,
  },

  docgen: {
    clear: true,
    runOnCompile: false,
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
