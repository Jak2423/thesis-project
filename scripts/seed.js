const { ethers } = require("hardhat");
const fs = require("fs");
const { faker } = require("@faker-js/faker");

const filesCount = 3;

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

      const files = generateLicenses(filesCount);

      for (const file of files) {
         const tx = await LicenseMarketplaceContract.createFile(
            file.fileName,
            file.expireDate,
            file.category,
            file.fileHash,
            file.isPublic,
            { gasLimit: 300000 },
         );
         await tx.wait();
         console.log(`File ${file.fileName} added successfully`);
      }

      console.log("Contract seeded successfully!");
   } catch (error) {
      console.error("Error seeding licenses:", error);
   }
}

function generateLicenses(count) {
   const files = [];

   for (let i = 0; i < count; i++) {
      const file = {
         fileName: faker.word.noun(2),
         description: faker.lorem.sentence(),
         category: "PDF",
         fileHash: "QmRPq61WNSuQTr4Cubenfar26qcTvnAUccm93Lj1zTAjAB",
         isPublic: true,
      };

      files.push(file);
   }

   return files;
}

seedLicenses()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
