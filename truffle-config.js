require("@babel/register");
require("@babel/polyfill");

const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonicPhrase = "laundry west dizzy maid aware genre slim describe width lunar rack screen";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    testnet: {
      provider: () => new HDWalletProvider({
      	  mnemonic: {
	    phrase: mnemonicPhrase
	  },
	  providerOrUrl: "https://rpc-mumbai.maticvigil.com"
      }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
