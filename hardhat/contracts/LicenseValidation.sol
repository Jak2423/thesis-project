// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LicenseValidation {
    struct License {
        string uid;
        string hash;
    }

    address public owner;
    mapping (string => License) public licenses;

    constructor() {
        owner = msg.sender;
    }

    event licenseGenerated(string uid);


    function generateLicense(string memory _uid, string memory _hash) public {
        require(bytes(licenses[_uid].hash).length == 0, "License with the same ID already exists");

        License memory lic  =  License({
            uid: _uid,
            hash: _hash
        });

        licenses[_uid] = lic;
        emit  licenseGenerated(_uid);
    }

    function getLicense(string memory _uid) public view returns(string memory, string memory) {
        require(
            bytes(licenses[_uid].hash).length != 0,
            "License with this ID does not exist"
        );

        License memory lic = licenses[_uid];

        return (
           lic.uid,
           lic.hash
        );
    }
}