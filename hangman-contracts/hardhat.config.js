require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { deploy } = require("./tasks/deploy");

const { PRIVATE_KEY } = process.env;
const accounts = [`0x${PRIVATE_KEY}`];

task("deploy", "Deploy contracts")
   .addParam("framework", "Zokrates or Noir")
   .setAction(async (taskArgs) => await deploy(taskArgs.framework));

module.exports = {
   solidity: {
     version: "0.8.19",
     settings: {
       optimizer: {
         enabled: true,
         runs: 1000,
       },
     },
   },
   defaultNetwork: "goerli",
   networks: {
      hardhat: {
         forking: {
            url: "https://eth-goerli.g.alchemy.com/v2/vCu8THEoktqJzsRg4GLVzkLJRIy8eskV",
            blockNumber: 9664092
         }
      },
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
      },
      scroll: {
         url: "https://rpc.scroll.io",
         accounts
      }
   }
}