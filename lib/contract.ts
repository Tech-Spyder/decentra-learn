// import { ethers } from "ethers";

// // const rewardContractAddress = "0xFB3efCfCA1ED7584B6E4b136A52Da54475DCD35C";
// // const rewardContractABI = [
// //   {
// //     "inputs": [],
// //     "stateMutability": "nonpayable",
// //     "type": "constructor"
// //   },
// //   {
// //     "anonymous": false,
// //     "inputs": [
// //       {
// //         "indexed": true,
// //         "internalType": "address",
// //         "name": "user",
// //         "type": "address"
// //       },
// //       {
// //         "indexed": false,
// //         "internalType": "uint256",
// //         "name": "xpAmount",
// //         "type": "uint256"
// //       }
// //     ],
// //     "name": "RewardClaimed",
// //     "type": "event"
// //   },
// //   {
// //     "inputs": [],
// //     "name": "claimFee",
// //     "outputs": [
// //       {
// //         "internalType": "uint256",
// //         "name": "",
// //         "type": "uint256"
// //       }
// //     ],
// //     "stateMutability": "view",
// //     "type": "function"
// //   },
// //   {
// //     "inputs": [
// //       {
// //         "internalType": "uint256",
// //         "name": "courseId",
// //         "type": "uint256"
// //       },
// //       {
// //         "internalType": "uint256",
// //         "name": "xpAmount",
// //         "type": "uint256"
// //       },
// //       {
// //         "internalType": "bytes",
// //         "name": "signature",
// //         "type": "bytes"
// //       }
// //     ],
// //     "name": "claimReward",
// //     "outputs": [],
// //     "stateMutability": "payable",
// //     "type": "function"
// //   },
// //   {
// //     "inputs": [],
// //     "name": "owner",
// //     "outputs": [
// //       {
// //         "internalType": "address",
// //         "name": "",
// //         "type": "address"
// //       }
// //     ],
// //     "stateMutability": "view",
// //     "type": "function"
// //   },
// //   {
// //     "inputs": [
// //       {
// //         "internalType": "bytes32",
// //         "name": "hash",
// //         "type": "bytes32"
// //       },
// //       {
// //         "internalType": "bytes",
// //         "name": "signature",
// //         "type": "bytes"
// //       }
// //     ],
// //     "name": "verifySignature",
// //     "outputs": [
// //       {
// //         "internalType": "bool",
// //         "name": "",
// //         "type": "bool"
// //       }
// //     ],
// //     "stateMutability": "view",
// //     "type": "function"
// //   },
// //   {
// //     "inputs": [
// //       {
// //         "internalType": "bytes32",
// //         "name": "hash",
// //         "type": "bytes32"
// //       },
// //       {
// //         "internalType": "bytes",
// //         "name": "signature",
// //         "type": "bytes"
// //       }
// //     ],
// //     "name": "recoverSigner",
// //     "outputs": [
// //       {
// //         "internalType": "address",
// //         "name": "",
// //         "type": "address"
// //       }
// //     ],
// //     "stateMutability": "pure",
// //     "type": "function"
// //   },
// //   {
// //     "inputs": [
// //       {
// //         "internalType": "bytes",
// //         "name": "sig",
// //         "type": "bytes"
// //       }
// //     ],
// //     "name": "splitSignature",
// //     "outputs": [
// //       {
// //         "internalType": "bytes32",
// //         "name": "r",
// //         "type": "bytes32"
// //       },
// //       {
// //         "internalType": "bytes32",
// //         "name": "s",
// //         "type": "bytes32"
// //       },
// //       {
// //         "internalType": "uint8",
// //         "name": "v",
// //         "type": "uint8"
// //       }
// //     ],
// //     "stateMutability": "pure",
// //     "type": "function"
// //   }
// // ]

// const rewardContractAddress = "0x351752ea8575286aBA8C3da58a8cB54A40617EfF";
// const rewardContractABI = [
//   {
//     inputs: [],
//     stateMutability: "nonpayable",
//     type: "constructor",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "user",
//         type: "address",
//       },
//       {
//         internalType: "uint256",
//         name: "courseId",
//         type: "uint256",
//       },
//     ],
//     name: "AlreadyClaimed",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "courseId",
//         type: "uint256",
//       },
//       {
//         internalType: "uint256",
//         name: "xpAmount",
//         type: "uint256",
//       },
//       {
//         internalType: "uint256",
//         name: "deadline",
//         type: "uint256",
//       },
//       {
//         internalType: "bytes",
//         name: "signature",
//         type: "bytes",
//       },
//     ],
//     name: "claimReward",
//     outputs: [],
//     stateMutability: "payable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "ECDSAInvalidSignature",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "length",
//         type: "uint256",
//       },
//     ],
//     name: "ECDSAInvalidSignatureLength",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "bytes32",
//         name: "s",
//         type: "bytes32",
//       },
//     ],
//     name: "ECDSAInvalidSignatureS",
//     type: "error",
//   },
//   {
//     inputs: [],
//     name: "FailedCall",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "balance",
//         type: "uint256",
//       },
//       {
//         internalType: "uint256",
//         name: "needed",
//         type: "uint256",
//       },
//     ],
//     name: "InsufficientBalance",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "sent",
//         type: "uint256",
//       },
//       {
//         internalType: "uint256",
//         name: "required",
//         type: "uint256",
//       },
//     ],
//     name: "InsufficientFee",
//     type: "error",
//   },
//   {
//     inputs: [],
//     name: "InvalidSignature",
//     type: "error",
//   },
//   {
//     inputs: [],
//     name: "ReentrancyGuardReentrantCall",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "bytes32",
//         name: "signatureHash",
//         type: "bytes32",
//       },
//     ],
//     name: "SignatureAlreadyUsed",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "deadline",
//         type: "uint256",
//       },
//       {
//         internalType: "uint256",
//         name: "currentTime",
//         type: "uint256",
//       },
//     ],
//     name: "SignatureExpired",
//     type: "error",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "newOwner",
//         type: "address",
//       },
//     ],
//     name: "transferOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "Unauthorized",
//     type: "error",
//   },
//   {
//     inputs: [],
//     name: "withdrawFees",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "ZeroAddress",
//     type: "error",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "oldDeadline",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "newDeadline",
//         type: "uint256",
//       },
//     ],
//     name: "DeadlineUpdated",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "oldFee",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "newFee",
//         type: "uint256",
//       },
//     ],
//     name: "FeeUpdated",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "previousOwner",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "newOwner",
//         type: "address",
//       },
//     ],
//     name: "OwnershipTransferred",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "user",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "courseId",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "xpAmount",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "bytes32",
//         name: "signatureHash",
//         type: "bytes32",
//       },
//     ],
//     name: "RewardClaimed",
//     type: "event",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "newFee",
//         type: "uint256",
//       },
//     ],
//     name: "updateClaimFee",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "newDeadline",
//         type: "uint256",
//       },
//     ],
//     name: "updateSignatureDeadline",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "claimFee",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "generateDeadline",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getBalance",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     name: "hasClaimed",
//     outputs: [
//       {
//         internalType: "bool",
//         name: "",
//         type: "bool",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "user",
//         type: "address",
//       },
//       {
//         internalType: "uint256",
//         name: "courseId",
//         type: "uint256",
//       },
//     ],
//     name: "hasClaimedReward",
//     outputs: [
//       {
//         internalType: "bool",
//         name: "",
//         type: "bool",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "bytes",
//         name: "signature",
//         type: "bytes",
//       },
//     ],
//     name: "isSignatureUsed",
//     outputs: [
//       {
//         internalType: "bool",
//         name: "",
//         type: "bool",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "owner",
//     outputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "signatureDeadline",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "bytes32",
//         name: "",
//         type: "bytes32",
//       },
//     ],
//     name: "usedSignatures",
//     outputs: [
//       {
//         internalType: "bool",
//         name: "",
//         type: "bool",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ];
// export async function getRewardContract(
//   walletProvider: ethers.Eip1193Provider
// ) {
//   const provider = new ethers.BrowserProvider(walletProvider);
//   const signer = await provider.getSigner();
//   return new ethers.Contract(rewardContractAddress, rewardContractABI, signer);
// }
import { ethers } from "ethers";

// ===== CRITICAL FIX =====
// Your contract address had a typo - extra 's' at the end
const rewardContractAddress = "0x351752ea8575286aBA8C3da58a8cB54A40617EfF"; // Fixed

const rewardContractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "courseId", type: "uint256" },
    ],
    name: "AlreadyClaimed",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "courseId", type: "uint256" },
      { internalType: "uint256", name: "xpAmount", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "length", type: "uint256" }],
    name: "ECDSAInvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes32", name: "s", type: "bytes32" }],
    name: "ECDSAInvalidSignatureS",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "sent", type: "uint256" },
      { internalType: "uint256", name: "required", type: "uint256" },
    ],
    name: "InsufficientFee",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSignature",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes32", name: "signatureHash", type: "bytes32" }],
    name: "SignatureAlreadyUsed",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "currentTime", type: "uint256" },
    ],
    name: "SignatureExpired",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "withdrawFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "oldDeadline", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newDeadline", type: "uint256" },
    ],
    name: "DeadlineUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "oldFee", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newFee", type: "uint256" },
    ],
    name: "FeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "courseId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "xpAmount", type: "uint256" },
      { indexed: false, internalType: "bytes32", name: "signatureHash", type: "bytes32" },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "newFee", type: "uint256" }],
    name: "updateClaimFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newDeadline", type: "uint256" }],
    name: "updateSignatureDeadline",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "generateDeadline",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "hasClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "courseId", type: "uint256" },
    ],
    name: "hasClaimedReward",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "signature", type: "bytes" }],
    name: "isSignatureUsed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "signatureDeadline",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "usedSignatures",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

// ===== FIXED getRewardContract FUNCTION =====
export async function getRewardContract(walletProvider: ethers.Eip1193Provider) {
  const provider = new ethers.BrowserProvider(walletProvider);
  const signer = await provider.getSigner();
  return new ethers.Contract(rewardContractAddress, rewardContractABI, signer);
}