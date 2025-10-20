// hooks/useCrossFiNetwork.ts
import { useEffect } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { usePrivy } from '@privy-io/react-auth'
import {  crossfiMainnet } from '@/lib/chains'


export function useCrossFiNetwork() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { authenticated } = usePrivy()
  
  const isOnCrossFi = chainId === crossfiMainnet.id
  
  const switchToCrossFi = async () => {
    try {
      await switchChain({ chainId: crossfiMainnet.id })
    } catch (error) {
      console.error('Failed to switch to CrossFi:', error)
    }
  }
  
  // Auto-switch to CrossFi when user is authenticated
  useEffect(() => {
    if (authenticated && !isOnCrossFi) {
      switchToCrossFi()
    }
  }, [authenticated, isOnCrossFi])
  
  return {
    isOnCrossFi,
    switchToCrossFi,
    currentChainId: chainId,
  }
}