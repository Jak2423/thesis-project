// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LicenseMarketplace {
    address public owner;

    struct File {
        uint256 id;
        address owner;
        string fileName;
        string description;
        string category;
        string fileHash;
        bool isPublic;
        uint256 createdAt;
    }

    struct License {
        uint256 licenseNumber;
        uint256 fileId;
        address owner;
        string fileName;
        string description;
        string category;
        string fileHash;
        bool isPublic;
        uint256 createdAt;
    }

    struct User {
        address _address;
        string firstname;
        string lastname;
        string username;
        string email;
        string password;
        bool isRegistered;
    }

    mapping(address => File[]) private userFiles;
    mapping (address => License[]) private fileLicenses;
    mapping (address => User) private users;
    mapping(uint256 => bool) public usedLicenses;


    File[] public publicFiles;
    User[] private registeredUsers;

    uint256 public fileId;

    event FileShared(address indexed  owner, string fileName, string fileHash, bool isPublic);
    event FileLicense(address indexed  owner, address indexed  buyer, string fileName, string fileHash);
    event userSignedUp(address indexed userAddress, string username);
    event userLoggedIn(address indexed userAddress, string username);

    modifier onlyRegisteredUser(){
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createFile(string memory _fileName, string memory _description, string memory _category,  string memory _fileHash, bool  _isPublic) external{
        fileId++;
        uint256 newId = fileId;

        File memory newFile = File({
            id: newId,
            owner: msg.sender,
            fileName: _fileName,
            description: _description,
            category: _category,
            fileHash: _fileHash,
            isPublic: _isPublic,
            createdAt: block.timestamp
        });

        userFiles[msg.sender].push(newFile);

        if(_isPublic) {
            publicFiles.push(newFile);
        }
        emit FileShared(msg.sender, _fileName, _fileHash, _isPublic);
    }

    function issueLicense(address _owner, uint256 _id, string memory _fileName, string memory _description, string memory _category,
        string memory _fileHash, bool  _isPublic) external {

        uint256 licNum = generateUniqueLicense();

        License memory newFile = License({
            licenseNumber: licNum,
            fileId: _id,
            owner: _owner,
            fileName: _fileName,
            description: _description,
            category: _category,
            fileHash: _fileHash,
            isPublic: _isPublic,
            createdAt: block.timestamp
        });

        fileLicenses[msg.sender].push(newFile);
        emit FileLicense(_owner, msg.sender, _fileName, _fileHash);
    }

    function getAllPublicFiles() external view returns(File[] memory) {
        return publicFiles;
    }

    function getAllUserFiles() external view returns(File[] memory) {
        return userFiles[msg.sender];
    }

    function getAllUserLicenses() external view returns(License[] memory) {
        return fileLicenses[msg.sender];
    }

    function signUp(string memory _firstname, string memory _lastname, string memory _username, string memory _email,
        string memory _password) public  {
            require(!users[msg.sender].isRegistered, "User already registered");

            User memory newUser = User({
                _address: msg.sender,
                firstname: _firstname,
                lastname: _lastname,
                username: _username,
                email: _email,
                password: _password,
                isRegistered: true
            });

            users[msg.sender] = newUser;
            registeredUsers.push(newUser);
            emit userSignedUp(msg.sender, _username);
    }

    function login(string memory _password) public onlyRegisteredUser returns(address, string memory, bool) {
        require(keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(users[msg.sender].password)), "Invlaid password");

        emit userLoggedIn(msg.sender, users[msg.sender].username);

        return (msg.sender, users[msg.sender].password, true);
    }

    function changeOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function resetPassword(string memory _newPassword) public onlyRegisteredUser{
        users[msg.sender].password = _newPassword;
    }

    function getAllRegisterdUsers() public view returns(User[] memory) {
        return registeredUsers;
    }

    function getPublicFilesExceptUser() external view returns (File[] memory) {
        uint256 senderFilesCount = userFiles[msg.sender].length;
        uint256 totalPublicFilesCount = publicFiles.length;

        File[] memory result = new File[](totalPublicFilesCount - senderFilesCount);
        uint256 index = 0;

        for (uint256 i = 0; i < totalPublicFilesCount; i++) {
            if (publicFiles[i].owner != msg.sender) {
                result[index] = publicFiles[i];
                index++;
            }
        }

        return result;
    }

    function generateUniqueLicense() internal returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 10**8;
        uint256 license = (randomNumber + 1) * 10**8;

        while (usedLicenses[license]) {
            randomNumber = uint256(keccak256(abi.encodePacked(randomNumber, block.timestamp)));
            license = (randomNumber + 1) * 10**8;
        }

        usedLicenses[license] = true;

        return license;
   }

   function validateLicense(uint256 licenseNumber) external view returns (bool) {
        return usedLicenses[licenseNumber];
   }

   function getPublicFileById(uint256 _id) external view returns (File memory) {
        for (uint256 i = 0; i < publicFiles.length; i++) {
            if (publicFiles[i].id == _id) {
                return publicFiles[i];
            }
        }
        revert("Public file not found");
    }
}