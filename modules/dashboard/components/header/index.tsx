import Image from "next/image";
import React, { useEffect, useState } from "react";
import Copy from "@/assets/svg/copy.svg";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useToast } from "@/modules/app/hooks/useToast";
import { CheckIcon } from "lucide-react";
import RewardsIcon from "@/assets/svg/rewards.svg";

export function Header() {
  const address = "0x34567....435";
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const copyToClipboard = useCopyToClipboard()[1];

  const copy = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (copied) return;
    if (address) {
      copyToClipboard(address);
      toast.success(`Referral link copied successfully.`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const dashboardStats = [
    {
      label: "Rewards",
      value: 59345345,
    },
    {
      label: "Streaks",
      value: 59,
    },
  ];
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="h-[236px] rounded-3xl w-full relative px-6 py-7 overflow-hidden">
        {/* Background image */}
        <Image
          src={"/courses/1.png"}
          alt="background"
          fill
          className="rounded-3xl object-cover"
        />

        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl z-10 rounded-3xl" />

        {/* Foreground content */}
        <div className="relative z-20 flex flex-col gap-7">
          <div className="flex items-center gap-4">
            <Image
              src={"/courses/2.png"}
              alt="profile"
              width={100}
              height={100}
              className="rounded-3xl"
            />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-[28px] text-white">
                  0x34567....435
                </h4>
                <div onClick={copy} className="cursor-pointer shrink-0">
                  {copied ? (
                    <CheckIcon className="text-foreground" />
                  ) : (
                    <Copy />
                  )}
                </div>
              </div>
              <div className="bg-[#6B4000] text-[#FDBA55] px-4 py-2 h-9 flex items-center justify-center w-fit rounded-full">
                Bronze
              </div>
            </div>
          </div>
          <XPProgress currentXP={200} totalXP={2345} />
        </div>
      </div>

      <div className="flex w-full items-center gap-[26px]">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-new-tertiary border border-border rounded-3xl w-full py-[29px] px-[26px] gap-6"
          >
            <h2 className="font-medium text-[32px] text-white">
              {stat.value} {stat.label === "Rewards" && "MPX"}
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
  totalXP: number;
};

function XPProgress({ currentXP, totalXP }: XPProgressProps) {
  const targetProgress = (currentXP / totalXP) * 100; // Target percentage
  const [progress, setProgress] = useState(0); // Start at 0%

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 100); // Small delay for smoothness
    return () => clearTimeout(timer);
  }, [targetProgress]);

  return (
    <div className="flex flex-col gap-2">
      {/* Progress Bar */}
      <div className="w-full bg-[#4A4A4A] h-6 rounded-md overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-[1200ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* XP Text */}
      <div className="flex justify-end font-medium text-sm">
        <span className="text-white">{currentXP} </span>
        <span className="text-gray-300">/ {totalXP} XP</span>
      </div>
    </div>
  );
}
