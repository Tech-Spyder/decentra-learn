"use client";

import React, { useState, useMemo } from "react";
import { Button } from "../button";
import { usePrivy } from "@privy-io/react-auth";
import { useCrossFiNetwork } from "../hooks/useCrossfiNetwork";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { getFormatAddress } from "@/utils";
import { useWalletBalance } from "@/modules/hooks/useWalletBalance";
import { useToast } from "../hooks/useToast";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import Copy from "@/assets/svg/copy.svg";
import { CheckIcon, ChevronRight, ChevronLeft, Menu, X } from "lucide-react";
import { useActivityCenterStore, useMobileNavStore } from "./state";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import Logo from "@/assets/svg/logo.svg";
import Link from "next/link";

export function StatusBar() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { isOnCrossFi, switchToCrossFi } = useCrossFiNetwork();
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const copyToClipboard = useCopyToClipboard()[1];
  const { isOpen, toggle } = useActivityCenterStore();
  const { isOpen: open, toggle: mobileToggle } = useMobileNavStore();

  const walletAddress = user?.wallet?.address;
  const { balance, isLoading, isError, SymbolIcon } = useWalletBalance(
    walletAddress,
    "crossfi"
  );

  const transition = useMemo(() => ({ duration: 0.25, ease: easeOut }), []);

  const copy = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (copied || !user?.wallet?.address) return;
    copyToClipboard(user.wallet.address);
    toast.success(`Address copied successfully.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isAppLoading = !ready || isLoading;

  return (
    <div className="w-full border-b border-b-border font-medium text-white items-center gap-4 pb-1">
      <div className="px-6 max-md:px-4 min-[1250px]:justify-end justify-between flex w-full md:my-3 md:mb-[9px] max-md:py-6 h-16">
        <div className="min-[1250px]:hidden flex items-center gap-3">
          <motion.div
            onClick={mobileToggle}
            className="cursor-pointer text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90, x: 5 }}
                  animate={{ opacity: 1, rotate: 0, x: 0 }}
                  exit={{ opacity: 0, rotate: 90, x: -5 }}
                  transition={transition}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={transition}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <Link href="/" className="flex items-center gap-3">
            <Logo className="size-6" />
            <p className="font-medium text-white sm:block hidden">
              DecentraLearn
            </p>
          </Link>
        </div>

        {isAppLoading ? (
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="animate-pulse h-8 w-24 bg-gray-700 rounded"></div>
            <div className="animate-pulse h-8 w-32 bg-gray-700 rounded"></div>
          </div>
        ) : authenticated ? (
          <div className="flex items-center gap-3">
            <div className="max-md:hidden">
              {isError ? (
                <div className="text-sm text-red-500">Balance error</div>
              ) : (
                <div className="flex items-center gap-1 font-semibold">
                  <span>{parseFloat(balance ?? "0").toFixed(2)}</span>
                  <SymbolIcon className="w-5 h-5" />
                </div>
              )}
            </div>

            <Popover>
              <PopoverTrigger>
                <div className="border bg-tertiary cursor-pointer border-border text-foreground px-2.5 py-1.5 rounded-full">
                  {getFormatAddress(walletAddress ?? "")}
                </div>
              </PopoverTrigger>
              <PopoverContent sideOffset={10} align="end" alignOffset={10}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-1 font-semibold md:hidden text-foreground">
                    <p className="text-sm font-normal">Balance:</p>
                    <span>{parseFloat(balance ?? "0").toFixed(2)}</span>
                    <SymbolIcon className="w-5 h-5" />
                  </div>
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

            {/* Activity Center Toggle */}
            <motion.div
              onClick={toggle}
              className="border bg-tertiary cursor-pointer border-border text-foreground p-1.5 rounded-full flex items-center justify-center min-[1250px]:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="left"
                    initial={{ opacity: 0, rotate: -90, x: 5 }}
                    animate={{ opacity: 1, rotate: 0, x: 0 }}
                    exit={{ opacity: 0, rotate: 90, x: -5 }}
                    transition={transition}
                  >
                    <ChevronLeft />
                  </motion.div>
                ) : (
                  <motion.div
                    key="right"
                    initial={{ opacity: 0, rotate: 90, x: -5 }}
                    animate={{ opacity: 1, rotate: 0, x: 0 }}
                    exit={{ opacity: 0, rotate: -90, x: 5 }}
                    transition={transition}
                  >
                    <ChevronRight />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          <Button
            onClick={() => login()}
            className="w-fit px-10 cursor-pointer"
          >
            Login
          </Button>
        )}

        {!isOnCrossFi && !isAppLoading && (
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
    </div>
  );
}
