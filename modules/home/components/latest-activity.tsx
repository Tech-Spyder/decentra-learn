import React from "react";
import Avatar from "@/assets/svg/avatar.svg";
import MPX from "@/assets/svg/mpx.svg";
import { formatDistanceToNowStrict } from "date-fns";
import { ScrollArea } from "@/modules/app/scroll-area";
import { Title } from "@/modules/app";


function formatShortRelativeTime(date: Date): string {
  const raw = formatDistanceToNowStrict(date, { addSuffix: false });
  // Map long units to short ones
  return raw
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", " min")
    .replace(" minute", " min")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" weeks", "w")
    .replace(" week", "w")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "y")
    .replace(" year", "y") + " ago";
}

export function LatestActivity() {
  return (
    <div className="bg-secondary rounded-3xl p-4 border border-border h-[400px] overflow-hidden relative pb-12">
      <div className="sticky top-0 z-10 bg-secondary pb-1">
        <Title title="Latest Activity" />
      </div>

      <ScrollArea.Root>
        {mockActivities.map((item) => (
          <ActivityItem
            key={item.id}
            date={item.date}
            avatar={item.avatar}
            amount={item.amount}
            rewardType={item.rewardType as "MPX" | "XP"}
          />
        ))}
      </ScrollArea.Root>
    </div>
  );
}

type ActivityItemProps = {
  date: Date;
  avatar: string;
  amount: number;
  rewardType?: "MPX" | "XP";
};

function ActivityItem({
  date,
  avatar,
  amount,
  rewardType = "MPX",
}: ActivityItemProps) {
  return (
    <div className="py-2 border-b border-b-border flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar
          className="w-8 h-8 min-w-8 rounded-full"
          alt="User Avatar"
        />
        <div className="flex flex-col">
          <p className="text-white text-sm font-medium">Claimed Rewards</p>
          <p className="text">
            {formatShortRelativeTime(date)}
          </p>
        </div>
      </div>
      <div className="bg-new-secondary p-2 rounded-full flex items-center gap-1 border border-border w-[105px] justify-center">
        {rewardType === "XP" ? "" : <MPX className="w-5 h-5" />}

        <p className="text-sm font-medium text-white">
          {amount} {rewardType}
        </p>
      </div>
    </div>
  );
}

const mockActivities = [
  {
    id: 1,
    date: new Date(),
    avatar: Avatar,
    amount: 100,
    rewardType: "MPX",
  },
  {
    id: 2,
    date: new Date(),
    avatar: Avatar,
    amount: 50,
    rewardType: "XP",
  },
  {
    id: 3,
    date: new Date(),
    avatar: Avatar,
    amount: 200,
    rewardType: "MPX",
  },
  {
    id: 4,
    date: new Date(),
    avatar: Avatar,
    amount: 80,
    rewardType: "XP",
  },
  {
    id: 5,
    date: new Date(),
    avatar: Avatar,
    amount: 300,
    rewardType: "MPX",
  },
  {
    id: 6,
    date: new Date(),
    avatar: Avatar,
    amount: 120,
    rewardType: "XP",
  },
];
