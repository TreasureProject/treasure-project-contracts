# Treasure (for Loot)

## Development

Install dependencies via Yarn:

```bash
yarn install
```

Setup Husky to format code on commit:

```bash
yarn prepare
```

Compile contracts via Hardhat:

```bash
yarn run hardhat compile
```

### Networks

Configurations are defined for `mainnet` and `rinkeby` networks.  Network forking is also available, and can be utilized by setting the `FORK_MODE` environment variable to `true` and `FORK_NETWORK` to either `mainnet` or `rinkeby`.

### Testing

Test contracts via Hardhat:

```bash
yarn run hardhat test
```

Activate gas usage reporting by setting the `REPORT_GAS` environment variable to `"true"`:

```bash
REPORT_GAS=true yarn run hardhat test
```

Generate a code coverage report using `solidity-coverage`:

```bash
yarn run hardhat coverage
```

### Documentation

A documentation site is output on contract compilation to the `docgen` directory.  It can also be generated manually:

```bash
yarn run hardhat docgen
```
