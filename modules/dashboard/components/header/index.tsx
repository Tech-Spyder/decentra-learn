"use client";

import Image from "next/image";
import React, { useState } from "react";
import Copy from "@/assets/svg/copy.svg";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useToast } from "@/modules/app/hooks/useToast";
import { CheckIcon } from "lucide-react";
import RewardsIcon from "@/assets/svg/rewards.svg";
import { usePrivy } from "@privy-io/react-auth";
import { getFormatAddress } from "@/utils";
import { useUserStats } from "@/modules/hooks/useUserStats";


const TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 7000,
  GOLD: 25000,
  PLATINUM: 70000,
} as const;

const calculateUserTier = (xp: number): string => {
  if (xp >= TIER_THRESHOLDS.PLATINUM) return "Platinum";
  if (xp >= TIER_THRESHOLDS.GOLD) return "Gold";
  if (xp >= TIER_THRESHOLDS.SILVER) return "Silver";
  return "Bronze";
};

const getNextTierThreshold = (xp: number): number => {
  if (xp >= TIER_THRESHOLDS.PLATINUM) return TIER_THRESHOLDS.PLATINUM;
  if (xp >= TIER_THRESHOLDS.GOLD) return TIER_THRESHOLDS.PLATINUM;
  if (xp >= TIER_THRESHOLDS.SILVER) return TIER_THRESHOLDS.GOLD;
  return TIER_THRESHOLDS.SILVER;
};

export function Header() {
  const { user, ready } = usePrivy();
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const copyToClipboard = useCopyToClipboard()[1];

  const { data: stats = { total_xp: 0, current_streak: 0, user_rank: "Bronze" }, isLoading } =
    useUserStats();

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


  const currentTier = calculateUserTier(stats.total_xp);
  const nextTierThreshold = getNextTierThreshold(stats.total_xp);
  const xpToNextTier = nextTierThreshold - stats.total_xp;

  const dashboardStats = [
    {
      label: "Rewards",
      value: stats.total_xp,
      unit: "XP",
    },
    {
      label: "Streaks",
      value: stats.current_streak,
      unit: "",
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-10">
        <div className="h-[236px] rounded-3xl w-full bg-new-tertiary animate-pulse" />
        <div className="flex w-full items-center gap-[26px]">
          <div className="bg-new-tertiary rounded-3xl w-full h-40 animate-pulse" />
          <div className="bg-new-tertiary rounded-3xl w-full h-40 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="h-[236px] rounded-3xl w-full relative px-6 py-7 overflow-hidden">
        <Image
          src={"/courses/1.png"}
          alt="background"
          fill
          className="rounded-3xl object-cover"
        />

        <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl z-10 rounded-3xl" />

        <div className="relative z-20 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Image
              src={"/courses/2.png"}
              alt="profile"
              width={100}
              height={100}
              className="rounded-3xl"
            />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 w-full">
                {!ready ? (
                  <div className="animate-pulse bg-new-element h-7 w-full" />
                ) : (
                  <h4 className="font-medium text-[28px] text-white">
                    {getFormatAddress(user?.wallet?.address ?? "")}
                  </h4>
                )}
                <div onClick={copy} className="cursor-pointer shrink-0">
                  {copied ? <CheckIcon className="text-foreground" /> : <Copy />}
                </div>
              </div>
              <div className="bg-[#6B4000] text-[#FDBA55] px-4 py-2 h-9 flex items-center justify-center w-fit rounded-full">
                {currentTier}
              </div>
            </div>
          </div>
          <XPProgress currentXP={stats.total_xp} xpToNextTier={xpToNextTier} />
        </div>
      </div>

      <div className="flex w-full items-center gap-[26px]">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-new-tertiary border border-border rounded-3xl w-full py-[29px] px-[26px] gap-6"
          >
            <h2 className="font-medium text-[32px] text-white">
              {stat.value.toLocaleString()} {stat.unit}
            </h2>

            <div className="bg-[#3E3E3E] h-9 rounded-full px-4 py-2 flex w-fit gap-2.5 font-medium text-lg items-center justify-center text-white">
              {stat.label === "Rewards" && <RewardsIcon />}
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type XPProgressProps = {
  currentXP: number;
  xpToNextTier: number;
};

function XPProgress({ currentXP, xpToNextTier }: XPProgressProps) {
  const currentTier = calculateUserTier(currentXP);
  const nextTierThreshold = getNextTierThreshold(currentXP);
  const currentTierStart =
    currentTier === "Platinum"
      ? TIER_THRESHOLDS.PLATINUM
      : currentTier === "Gold"
      ? TIER_THRESHOLDS.GOLD
      : currentTier === "Silver"
      ? TIER_THRESHOLDS.SILVER
      : TIER_THRESHOLDS.BRONZE;

  const progressInTier = currentXP - currentTierStart;
  const tierRange = nextTierThreshold - currentTierStart;
  const progressPercent = Math.min((progressInTier / tierRange) * 100, 100);

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progressPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  const nextTier =
    currentTier === "Bronze"
      ? "Silver"
      : currentTier === "Silver"
      ? "Gold"
      : currentTier === "Gold"
      ? "Platinum"
      : "Platinum";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white font-medium">
          {currentTier}
          {xpToNextTier > 0 && ` → ${nextTier}`}
        </span>
        {xpToNextTier > 0 && (
          <span className="text-gray-400">
            {xpToNextTier.toLocaleString()} XP to next tier
          </span>
        )}
      </div>

      <div className="w-full bg-[#4A4A4A] h-4 rounded-md overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-[1200ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-end font-medium text-sm gap-1">
        <span className="text-white">{currentXP.toLocaleString()}</span>
        <span className="text-gray-300">/ {(currentXP + xpToNextTier).toLocaleString()} XP</span>
      </div>
    </div>
  );
}