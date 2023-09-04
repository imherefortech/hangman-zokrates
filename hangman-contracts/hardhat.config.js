require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { PRIVATE_KEY } = process.env;
const accounts = [`0x${PRIVATE_KEY}`];

module.exports = {
   solidity: "0.8.19",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: "https://rpc.ankr.com/eth_goerli",
         accounts
      },
      scrollSepolia: {
         url: "https://sepolia-rpc.scroll.io/",
         accounts
      },
      polygon: {
         url: "https://polygon.llamarpc.com",
         accounts
      }
   },
}