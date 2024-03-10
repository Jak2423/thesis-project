const { ethers, upgrades } = require("hardhat");

async function main() {
   const contract = await ethers.getContractFactory("LicenseValidation");
   console.log("Upgrading ...");
   await upgrades.upgradeProxy(
      "0xCbb31F1055B39228f8d4b02CF04B3ff58C2f17E5",
      contract,
   );
   console.log("Upgraded");
}

main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
});
