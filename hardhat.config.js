require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
   defaultNetwork: "sepolia",
   networks: {
      hardhat: {},
      sepolia: {
         url: process.env.ALCHEMY_API_URL,
         accounts: [process.env.PRIVATE_KEY],
      },
   },
   solidity: {
      version: "0.8.24",
      settings: {
         optimizer: {
            enabled: true,
            runs: 200,
         },
      },
   },
};
