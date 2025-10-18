"use client";

import React, { useState } from "react";
import { Button } from "../button";
import { usePrivy } from "@privy-io/react-auth";
import { useCrossFiNetwork } from "../hooks/useCrossfiNetwork";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { getFormatAddress } from "@/utils";
import { useWalletBalance } from "@/modules/hooks/useWalletBalance";
import { useToast } from "../hooks/useToast";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import Copy from "@/assets/svg/copy.svg";
import { CheckIcon, DivideIcon } from "lucide-react";

export function StatusBar() {
  const { login, logout, authenticated, user } = usePrivy();
  const { isOnCrossFi, switchToCrossFi } = useCrossFiNetwork();
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const copyToClipboard = useCopyToClipboard()[1];

  const walletAddress = user?.wallet?.address;
  const { balance, isLoading, isError, SymbolIcon } = useWalletBalance(
    walletAddress,
    "crossfi"
  );
  const copy = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (copied) return;
    if (user?.wallet?.address) {
      copyToClipboard(user.wallet.address);
      toast.success(`Address copied successfully.`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="flex w-full h-16 justify-end mt-6 px-6 font-medium text-white items-center gap-4">
      {authenticated ? (
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="text-sm text-gray-400">Loading balance...</div>
          ) : isError ? (
            <div className="text-sm text-red-500">Balance error</div>
          ) : (
            <div className="flex items-center gap-1 font-semibold">
              <span>{parseFloat(balance ?? "0").toFixed(2)}</span>
              <SymbolIcon className="w-5 h-5" />
            </div>
          )}

          <Popover>
            <PopoverTrigger>
              <div className="border bg-tertiary cursor-pointer border-border text-foreground px-2.5 py-1.5 rounded-full">
                {getFormatAddress(walletAddress ?? "")}
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" alignOffset={10}>
              <div className="flex flex-col gap-4">
                <div
                  onClick={copy}
                  className="cursor-pointer shrink-0 text-foreground flex items-center gap-3 text-sm hover:text-white/75 transition-all duration-200 ease-out"
                >
                  Copy Wallet Address{" "}
                  {copied ? (
                    <CheckIcon className="text-foreground" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </div>
                <div
                  onClick={logout}
                  className="w-full px-2 h-7 bg-red-500/5 text-red-300 flex items-center text-sm border border-red-400 cursor-pointer rounded-lg hover:text-red-500 hover:bg-red-500/20 transition-all duration-200 ease-out"
                >
                  Disconnect Wallet
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Button onClick={() => login()} className="w-fit px-10 cursor-pointer">
          Login
        </Button>
      )}

      {!isOnCrossFi && (
        <div className="flex flex-col bg-red-500/10 border border-red-500 rounded-lg p-2 text-sm text-red-400">
          <p>You&apos;re not on CrossFi network!</p>
          <button
            onClick={switchToCrossFi}
            className="text-red-300 underline text-xs mt-1"
          >
            Switch to CrossFi
          </button>
        </div>
      )}
    </div>
  );
}
