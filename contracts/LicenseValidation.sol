// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LicenseValidation {
    struct License {
        uint256 id;
        string licenseNum;
        string licenseName;
        uint256 issuedDate;
        uint256 expireDate;
        string description;
        address licenseOwner;
    }

    uint256 public id;
    string[] public licenseNumbers;

    mapping (string => License) public licenses;

    event Issued(uint256 id, address issuer, string licenseNum, uint256 timestamp);
    event Transferred(address from, address to, string licenseNum, uint256 timestamp);

    modifier onlyOwner(string memory _licenseNum) {
        require(licenses[_licenseNum].licenseOwner == msg.sender, "You are not the owner of this license");
        _;
    }

    constructor() {
        id = 0;
    }

    function addLicense(string memory _licenseNum, string memory _licenseName, uint256 _expireDate, string memory _desc) public  {
        License memory lic = licenses[_licenseNum];

        require(lic.id == 0, "License already registered");
        require(_expireDate == 0 || block.timestamp < _expireDate, "Expire date can't be past");

        lic.id = ++id;
        lic.licenseNum = _licenseNum;
        lic.licenseName = _licenseName;
        lic.licenseOwner = msg.sender;
        lic.expireDate = _expireDate;
        lic.issuedDate = block.timestamp;
        lic.description = _desc;

        licenses[_licenseNum] = lic;
        licenseNumbers.push(_licenseNum);

        emit Issued(lic.id, msg.sender, _licenseNum, block.timestamp);
    }

    function transferLicense(address _newOwner, string memory _licenseNum) public onlyOwner(_licenseNum) {
        License storage lic = licenses[_licenseNum];

        lic.licenseOwner = _newOwner;

        emit Transferred(msg.sender, _newOwner, _licenseNum, block.timestamp);
    }

    function getLicense(string memory _licenseNum) view public returns (License memory) {
        return licenses[_licenseNum];
    }

    function getAllLicenses() view public returns (License[] memory) {
        License[] memory allLicenses = new License[](licenseNumbers.length);

        for (uint256 i = 0; i < licenseNumbers.length; i++) {
            allLicenses[i] = licenses[licenseNumbers[i]];
        }

        return allLicenses;
    }

    function getUserLicenses() view public returns (License[] memory) {
        uint256 userLicenseCount = 0;

        for (uint256 i = 0; i < licenseNumbers.length; i++) {
            if (licenses[licenseNumbers[i]].licenseOwner == msg.sender) {
                userLicenseCount++;
            }
        }

        License[] memory userLicenses = new License[](userLicenseCount);
        uint256 userIndex = 0;

        for (uint256 i = 0; i < licenseNumbers.length; i++) {
            if (licenses[licenseNumbers[i]].licenseOwner == msg.sender) {
                userLicenses[userIndex] = licenses[licenseNumbers[i]];
                userIndex++;
            }
        }

        return userLicenses;
    }

    function isLicenseValid(string memory _licenseNum) view public returns (bool) {
        return licenses[_licenseNum].id != 0;
    }
}
