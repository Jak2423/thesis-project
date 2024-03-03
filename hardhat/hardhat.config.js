require('dotenv').config(); //all the key value pairs are being made available due to this lib
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
	solidity: '0.8.24',
	defaultNetwork: 'sepolia',
	networks: {
		hardhat: {},
		sepolia: {
			url: `${process.env.API_URL}`,
			accounts: [`0x${process.env.PRIVATE_KEY}`],
		},
	},
};
