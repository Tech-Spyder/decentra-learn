// config/chains.ts
import { defineChain } from 'viem'

// export const crossfi = defineChain({
//   id: 4157, // CrossFi Testnet chain ID
//   name: 'CrossFi Testnet',
//   network: 'crossfi-testnet',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'XFI',
//     symbol: 'XFI',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://rpc.testnet.ms'],
//     },
//     public: {
//       http: ['https://rpc.testnet.ms'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'CrossFi Explorer', url: 'https://test.xfiscan.com' },
//   },
// })

// For mainnet, use:
export const crossfiMainnet = defineChain({
  id: 4158,
  name: 'CrossFi',
  network: 'crossfi',
  nativeCurrency: { decimals: 18, name: 'XFI', symbol: 'XFI' },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.ms'] },
    public: { http: ['https://rpc.mainnet.ms'] },
  },
  blockExplorers: {
    default: { name: 'CrossFi Explorer', url: 'https://xfiscan.com' },
  },
})