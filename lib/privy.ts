// config/privy.ts
import type { PrivyClientConfig } from '@privy-io/react-auth'
import { crossfi } from './chains'

export const privyConfig: {
  appId: string
  config: PrivyClientConfig
} = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  config: {
    loginMethods: ['email', 'wallet'],
    appearance: {
      theme: 'dark' as const, // or 'dark' as const
      accentColor: '#676FFF',
    },
    defaultChain: crossfi,
    supportedChains: [crossfi],
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      requireUserPasswordOnCreate: false,
    },
  },
}