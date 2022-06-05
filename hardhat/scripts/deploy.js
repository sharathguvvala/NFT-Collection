const hre = require("hardhat");

const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants/index");

const whitelistContract = WHITELIST_CONTRACT_ADDRESS;
const metadataURL = METADATA_URL;

async function main() {
    const NFTCollection = await hre.ethers.getContractFactory("Web3Devs")
    const NFTCollectionContract = await NFTCollection.deploy(metadataURL,whitelistContract)
    await NFTCollectionContract.deployed()
    console.log("NFT Collection Smart Contract address",NFTCollectionContract.address)
}
  

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});
  