"use client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useToast } from "../app/hooks/useToast";
import { PrivyProvider } from "@privy-io/react-auth";
import * as Tooltip from "@radix-ui/react-tooltip";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { privyConfig } from "@/lib/privy";
import dynamic from "next/dynamic";

type QueryProviderProps = {
  children: ReactNode;
};
const Toast = dynamic(() => import("@/modules/toast/toast"), {
  ssr: false,
});
export function Provider({ children }: QueryProviderProps) {
  const toast = useToast();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 0 } },
        mutationCache: new MutationCache({
          onMutate: () => {
            toast.loading("Transaction In Process...", { duration: 30000 });
          },
          onSuccess: (_data, _variables, _context, mutation) => {
            const successMessage = mutation?.meta?.successMessage as {
              title?: string;
              description: string;
            };

            toast.success(
              successMessage
                ? successMessage.description
                : "Transaction was Successful",
              {
                duration: 5000,
              }
            );
          },
          onError: (error: Error, _variables, _context, mutation) => {
            const errorMessage = mutation?.meta?.errorMessage as {
              title?: string;
              description: string;
            };

            toast.error(
              errorMessage
                ? `${errorMessage.description} ${error.message}`
                : error.message,
              {
                duration: 5000,
              }
            );
          },
        }),
      })
  );

  return (
    <PrivyProvider {...privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <Tooltip.Provider>{children}
            <Toast/>
          </Tooltip.Provider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
