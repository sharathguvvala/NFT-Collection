require("@nomiclabs/hardhat-waffle");
require("dotenv").config({path:".env"})

const INFURA_API_URL = process.env.INFURA_API_URL
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: INFURA_API_URL,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};
