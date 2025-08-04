// config/wagmi.ts
import { createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { http } from 'viem'
import { crossfi } from './chains'

export const wagmiConfig = createConfig({
  chains: [crossfi, mainnet, sepolia], 
  transports: {
    [crossfi.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})