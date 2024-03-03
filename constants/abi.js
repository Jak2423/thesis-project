export const abi = {
   abi: [
      {
         inputs: [],
         stateMutability: "nonpayable",
         type: "constructor",
      },
      {
         anonymous: false,
         inputs: [
            {
               indexed: false,
               internalType: "string",
               name: "uid",
               type: "string",
            },
         ],
         name: "licenseGenerated",
         type: "event",
      },
      {
         inputs: [
            {
               internalType: "string",
               name: "_uid",
               type: "string",
            },
            {
               internalType: "string",
               name: "_hash",
               type: "string",
            },
         ],
         name: "generateLicense",
         outputs: [],
         stateMutability: "nonpayable",
         type: "function",
      },
      {
         inputs: [
            {
               internalType: "string",
               name: "_uid",
               type: "string",
            },
         ],
         name: "getLicense",
         outputs: [
            {
               internalType: "string",
               name: "",
               type: "string",
            },
            {
               internalType: "string",
               name: "",
               type: "string",
            },
         ],
         stateMutability: "view",
         type: "function",
      },
      {
         inputs: [
            {
               internalType: "string",
               name: "",
               type: "string",
            },
         ],
         name: "licenses",
         outputs: [
            {
               internalType: "string",
               name: "uid",
               type: "string",
            },
            {
               internalType: "string",
               name: "hash",
               type: "string",
            },
         ],
         stateMutability: "view",
         type: "function",
      },
      {
         inputs: [],
         name: "owner",
         outputs: [
            {
               internalType: "address",
               name: "",
               type: "address",
            },
         ],
         stateMutability: "view",
         type: "function",
      },
   ],
};
