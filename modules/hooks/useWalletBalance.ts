"use client";

import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import XFI from "@/assets/svg/xfi.svg";

type NetworkConfig = {
  chainId: number;
  rpcUrl: string;
  symbol: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
};

const NETWORKS: Record<string, NetworkConfig> = {
  crossfi: {
    chainId: 4158,
    rpcUrl: "https://rpc.mainnet.ms",
    symbol: XFI, 
    name: "CrossFi",
  },
};

export function useWalletBalance(
  walletAddress?: string,
  networkKey: keyof typeof NETWORKS = "crossfi"
) {
  const network = NETWORKS[networkKey];

  const {
    data: balance,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["wallet-balance", walletAddress, networkKey],
    queryFn: async () => {
      if (!walletAddress) return "0";
      try {
        const provider = new ethers.JsonRpcProvider(network.rpcUrl);
        const bal = await provider.getBalance(walletAddress);
        return ethers.formatEther(bal);
      } catch (err) {
        console.error(
          `[useWalletBalance] Error fetching ${network.name} balance:`,
          err
        );
        return "0";
      }
    },
    enabled: !!walletAddress,
    staleTime: 1000 * 60 * 2, 
    refetchInterval: 1000 * 30,
  });

  return {
    balance,
    isLoading,
    isError,
    refetch,
    SymbolIcon: network.symbol,
    name: network.name,
  };
}
