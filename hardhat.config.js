require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   defaultNetwork: "sepolia",
   networks: {
      hardhat: {},
      sepolia: {
         url: "https://eth-sepolia.g.alchemy.com/v2/sv1_PEafvRLL4jqedL_aHnGlbevY4eDY",
         accounts: [
            "0x8553f6c2902ec34cf8bdba90f3b95231a4cbd5b642c96d97d640fb976f9de5f9",
         ],
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
