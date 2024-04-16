// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LicenseMarketplace {
    address public owner;

   struct File {
        uint256 id;
        address fileOwner;
        string fileName;
        string description;
        string category;
        string fileCid;
        bool isPublic;
        uint256 createdAt;
    }

    struct License {
        uint256 licenseNumber;
        uint256 fileId;
        address fileOwner;
        address buyer;
        string fileName;
        string description;
        string category;
        string fileCid;
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

    struct LicenseRequest {
        uint256 requestId;
        uint256 fileId;
        address requester;
        address fileOwner;
        bool isApproved;
    }

    mapping(address => File[]) private userFiles;
    mapping (address => License[]) private fileLicenses;
    mapping (uint256 => LicenseRequest) private licenseRequests;

    mapping (address => User) private users;
    mapping(uint256 => bool) public usedLicenses;


    File[] public publicFiles;
    User[] private registeredUsers;

    uint256 public fileId;
    uint256 public requestId;

    event FileShared(address indexed  owner, string fileName, string fileCid, bool isPublic);
    event FileLicense(address indexed  owner, address indexed  buyer, string fileName, string fileCid);
    event userSignedUp(address indexed userAddress, string username);
    event userLoggedIn(address indexed userAddress, string username);
    event LicenseRequestCreated(uint256 indexed requestId, uint256 fileId, address requester, address fileOwner);
    event LicenseRequestApproved(uint256 indexed requestId, uint256 fileId, address requester, address fileOwner);
    event LicenseRequestRejected(uint256 indexed requestId, uint256 fileId, address requester, address fileOwner);


    modifier onlyRegisteredUser(){
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner,  "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createFile(string memory _fileName, string memory _description, string memory _category,  string memory _fileCid, bool  _isPublic) external{
        fileId++;

        File memory newFile = File({
            id: fileId,
            fileOwner: msg.sender,
            fileName: _fileName,
            description: _description,
            category: _category,
            fileCid: _fileCid,
            isPublic: _isPublic,
            createdAt: block.timestamp
        });

        userFiles[msg.sender].push(newFile);

        if(_isPublic) {
            publicFiles.push(newFile);
        }
        emit FileShared(msg.sender, _fileName, _fileCid, _isPublic);
    }

    function requestLicense(uint256 _fileId, address _fileOwner) external {
        requestId++;
        LicenseRequest memory newRequest = LicenseRequest({
            requestId: requestId,
            fileId: _fileId,
            requester: msg.sender,
            fileOwner: _fileOwner,
            isApproved: false
        });

        licenseRequests[requestId] = newRequest;
        emit LicenseRequestCreated(requestId, _fileId, msg.sender, _fileOwner);
    }


    function approveLicenseRequest(uint256 _requestId) external {
        LicenseRequest storage request = licenseRequests[_requestId];
        require(request.fileOwner == msg.sender, "Only the file owner can approve the request");
        require(!request.isApproved, "Request already approved");

        request.isApproved = true;

        File memory file = getPublicFileById(request.fileId);
        uint256 licNum = generateUniqueLicense();

        License memory newLicense = License({
            licenseNumber: licNum,
            fileId: file.id,
            fileOwner: file.fileOwner,
            buyer: request.requester,
            fileName: file.fileName,
            description: file.description,
            category: file.category,
            fileCid: file.fileCid,
            isPublic: file.isPublic,
            createdAt: block.timestamp
        });

        fileLicenses[request.requester].push(newLicense);

        emit FileLicense(file.fileOwner, request.requester, file.fileName, file.fileCid);
        emit LicenseRequestApproved(_requestId, request.fileId, request.requester, request.fileOwner);
    }

    function rejectLicenseRequest(uint256 _requestId) external  {
        LicenseRequest storage request = licenseRequests[_requestId];
        require(request.fileOwner == msg.sender, "Only the file owner can reject the request");
        require(!request.isApproved, "Request already approved");

        delete licenseRequests[_requestId];
        emit LicenseRequestRejected(_requestId, request.fileId, request.requester, request.fileOwner);
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

    function resetPassword(string memory _newPassword) public onlyRegisteredUser{
        users[msg.sender].password = _newPassword;
    }

    function getAllRegisterdUsers() public view returns(User[] memory) {
        return registeredUsers;
    }


    function getPublicFilesExceptUser() external view returns (File[] memory) {
      uint256 senderFilesCount = userFiles[msg.sender].length;
      uint256 totalPublicFilesCount = publicFiles.length;

      uint256 excludedFilesCount = senderFilesCount;
      for (uint256 i = 0; i < fileLicenses[msg.sender].length; i++) {
         if (fileLicenses[msg.sender][i].isPublic) {
               excludedFilesCount++;
         }
      }

      File[] memory result = new File[](totalPublicFilesCount - excludedFilesCount);
      uint256 index = 0;

      for (uint256 i = 0; i < totalPublicFilesCount; i++) {
         bool isUserFile = false;
         bool hasUserLicense = false;

         for (uint256 j = 0; j < senderFilesCount; j++) {
               if (publicFiles[i].id == userFiles[msg.sender][j].id) {
                  isUserFile = true;
                  break;
               }
         }

         for (uint256 k = 0; k < fileLicenses[msg.sender].length; k++) {
               if (publicFiles[i].id == fileLicenses[msg.sender][k].fileId) {
                  hasUserLicense = true;
                  break;
               }
         }

         if (!isUserFile && !hasUserLicense) {
               result[index] = publicFiles[i];
               index++;
         }
      }

      return result;
   }

    function generateUniqueLicense() internal returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number), msg.sender)));
        uint256 license = randomNumber % 10000000000;

        while (usedLicenses[license]) {
            randomNumber = uint256(keccak256(abi.encodePacked(randomNumber, block.timestamp)));
            license = randomNumber % 10000000000;
        }

        usedLicenses[license] = true;

        return license;
    }

   function validateLicense(uint256 licenseNumber) external view returns (bool) {
        return usedLicenses[licenseNumber];
   }

   function getPublicFileById(uint256 _id) public view returns (File memory) {
        for (uint256 i = 0; i < publicFiles.length; i++) {
            if (publicFiles[i].id == _id) {
                return publicFiles[i];
            }
        }
        revert("Public file not found");
    }

    function getUserLicenseRequests() external view returns (LicenseRequest[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= requestId; i++) {
            if (licenseRequests[i].requester == msg.sender) {
                count++;
            }
        }

        LicenseRequest[] memory userRequests = new LicenseRequest[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= requestId; i++) {
            if (licenseRequests[i].requester == msg.sender) {
                userRequests[index] = licenseRequests[i];
                index++;
            }
        }

        return userRequests;
    }

   function getFileOwnerLicenseRequests() external view returns (LicenseRequest[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= requestId; i++) {
            if (licenseRequests[i].fileOwner == msg.sender) {
                count++;
            }
        }

        LicenseRequest[] memory ownerRequests = new LicenseRequest[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= requestId; i++) {
            if (licenseRequests[i].fileOwner == msg.sender) {
                ownerRequests[index] = licenseRequests[i];
                index++;
            }
        }

        return ownerRequests;
   }

   function isFileOwnedOrLicensed(address _user, uint256 _fileId) external view returns (bool) {
        for (uint256 i = 0; i < userFiles[_user].length; i++) {
            if (userFiles[_user][i].id == _fileId) {
                return true;
            }
        }

        for (uint256 j = 0; j < fileLicenses[_user].length; j++) {
            if (fileLicenses[_user][j].fileId == _fileId) {
                return true;
            }
        }

        return false;
   }


   function getFileId() external view returns (uint256) {
        return fileId + 1;
   }
}