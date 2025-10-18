// config/wagmi.ts
import { createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { http } from 'viem'
import {  crossfiMainnet } from './chains'

export const wagmiConfig = createConfig({
  chains: [ crossfiMainnet, mainnet, sepolia],
  transports: {
    // [crossfi.id]: http(),
    [crossfiMainnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})