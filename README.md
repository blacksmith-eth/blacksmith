# Blacksmith

Blacksmith generates a simple frontend for interacting with smart contracts.

This tool is specifically intended to be used with [Foundry](https://getfoundry.sh/).

_Note: Recent changes to Foundry break Blacksmith contract verification/import. Until this is addressed please roll back to the previous version of Foundry noted below._

```bash
foundryup --version nightly-94777647f6ea5d34572a1b15c9b57e35b8c77b41
```

## Installation

Clone the repo.

```bash
git clone https://github.com/blacksmith-eth/blacksmith.git
```

## Quick Start

Start the Blacksmith application.

```bash
cd blacksmith
pnpm install
pnpm dev
```

In a second terminal window start a local testnet node.

```bash
anvil
```

In a third terminal window create a foundry project in a separate directory.

```bash
forge init example
cd example
```

From the foundry directory deploy the counter contract to your local testnet node.

```bash
forge create src/Counter.sol:Counter --verify --unlocked \
--from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 \
--rpc-url http://localhost:8545 \
--verifier-url http://localhost:3000/api/verify \
--etherscan-api-key blacksmith
```

_Note: If this command fails see the Foundry Configuration section at the bottom of the README._

Navigate to [http://localhost:3000](http://localhost:3000), click the connect wallet button, and choose Blacksmith.

_Note: Refresh the page if the wallet modal fails to dismiss._

Select the Counter contract in the contracts sidebar and begin interacting!

## Forking Mainnet

Replace the `$INFURA_KEY` with your personal API key.

```bash
anvil --fork-url https://mainnet.infura.io/v3/$INFURA_KEY
```

Navigate to the Blacksmith "Getting Started" page by clicking the "Blacksmith" heading.

In the "Contract Management" section enter the contract address for Dai `0x6b175474e89094c44da98b954eedeac495271d0f` and click the import button.

Select the Dai contract in the contracts sidebar and begin interacting!

Example: Try entering `0xad0135af20fa82e106607257143d0060a7eb5cbf` into the `balanceOf` function.

_Note: In order for the contract import to succeed, the contract must be verified on Etherscan._

## Advanced Usage

Create a `.env.local` in the root directory of Blacksmith and include your API key to avoid rate limits.

```bash
echo "ETHERSCAN_API_KEY=XXX" >> .env.local
```

## Script Imports

An example of the CLI arguments needed to import contracts via `forge script` can be found below.

```bash
forge script script/Counter.s.sol:CounterScript --broadcast --verify --unlocked \
--sender 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 \
--fork-url http://localhost:8545 \
--verifier-url http://localhost:3000/api/verify \
--etherscan-api-key blacksmith
```

## Hardhat

If you're working with Hardhat check out [🏗 scaffold-eth](https://github.com/scaffold-eth/scaffold-eth)!

## Foundry Configuration

Historically `forge` has encountered issues reading the `ETHERSCAN_API_KEY` from the command line arguments.

If you are seeing an error when deploying your contract such as `ETHERSCAN_API_KEY must be set`, then consider adding the following to your `foundry.toml` file.

```toml
[etherscan]
anvil = { key = "blacksmith", url = "http://localhost:3000/api/verify" }
```

Unfortunately, this workaround requires the localhost port to be hardcoded to 3000. Be mindful of this if running Blacksmith on a different port.
