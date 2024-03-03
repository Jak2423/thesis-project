const hre = require('hardhat');

async function main() {
	const licenseValidation = await hre.ethers.deployContract('LicenseValidation');
	await licenseValidation.waitForDeployment();

	console.log('LicenseValidation deployed to:', await licenseValidation.getAddress());
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
