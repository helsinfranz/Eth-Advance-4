# Eth-Advance-4

The Smart Contract Wallet app offers users the ability to utilize a smart contract as their wallet, replacing the traditional externally owned account (EOA) approach. With this web-app, users can easily send and receive funds, check their balance, and take advantage of the Account Abstraction feature powered by EIP-4337.

## Getting Started

### Installation

Install all node dependencies

```
npm i
```

Deploy the test hardhat node

```
npx hardhat node
```

Deploy the contract on the hardhat network using the deploy.js script

```
npx hardhat run scripts/deploy.js --network localhost
```

Start the next.js development live server

```
npm run dev
```

### Execution

To test the functionality of this Smart Contract Wallet web-app, follow these steps:

1. `Create two accounts` for testing purposes.

2. Click on the `Create account` button to generate a smart contract. This contract will be created from the `factory contract` and linked to the `Entry Point` Contract.

3. After the creation process, you will be provided with a `new smart contract` address. This address will serve as the destination for depositing or transferring assets, with the unit of measurement being WEI in this particular case.

4. At this point, you will notice two buttons: `Add Funds` and `Send Funds`. These buttons enable you to add funds to the wallet or send funds to another wallet, respectively.
