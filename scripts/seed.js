const { ethers } = require("hardhat");
const fs = require("fs");
const { faker } = require("@faker-js/faker");

const licensesCount = 3;

async function seedLicenses() {
   try {
      const contractAddrJson = fs.readFileSync(
         "./contracts/contractAddress.json",
         "utf8",
      );
      const { contractAddress: LicenseValidContract } =
         JSON.parse(contractAddrJson);

      const LicenseMarketplaceContract = await ethers.getContractAt(
         "LicenseMarketplace",
         LicenseValidContract,
      );

      const licenses = generateLicenses(licensesCount);

      for (const license of licenses) {
         const tx = await LicenseMarketplaceContract.addLicense(
            license.licenseNum,
            license.licenseName,
            license.expireDate,
            license.description,
            { gasLimit: 300000 },
         );
         await tx.wait();
         console.log(`License ${license.licenseNum} added successfully`);
      }

      console.log("Contract seeded successfully!");
   } catch (error) {
      console.error("Error seeding licenses:", error);
   }
}

function generateLicenses(count) {
   const licenses = [];

   for (let i = 0; i < count; i++) {
      const license = {
         licenseNum: faker.vehicle.vin(),
         licenseName: faker.word.words(3),
         expireDate: faker.date.future().getTime(),
         description: faker.lorem.sentence(),
      };

      licenses.push(license);
   }

   return licenses;
}

seedLicenses()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
