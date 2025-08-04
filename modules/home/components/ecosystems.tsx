"use client";

import React from "react";
import Link from "next/link";
import Crossfi from "@/assets/svg/ecosystems/crossfi.svg";
import Arb from "@/assets/svg/ecosystems/arb.svg";
import Base from "@/assets/svg/ecosystems/base.svg";
import Eth from "@/assets/svg/ecosystems/eth.svg";
import OP from "@/assets/svg/ecosystems/op.svg";
import { Title } from "@/modules/app";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/modules/app/tooltip";
// adjust path if needed

const ecosystemsData = [
  {
    id: "crossfi",
    icon: <Crossfi />,
    bgColor: "#001F29",
    borderColor: "#0CC2FF",
  },
  {
    id: "arb",
    icon: <Arb />,
    bgColor: "#213147",
    borderColor: "#12AAFF",
  },
  {
    id: "base",
    icon: <Base />,
    bgColor: "#000D29",
    borderColor: "#0052FF",
  },
  {
    id: "eth",
    icon: <Eth />,
    bgColor: "#1C1C1C",
    borderColor: "#FFFFFF",
  },
  {
    id: "op",
    icon: <OP />,
    bgColor: "#380006",
    borderColor: "#FE0420",
  },
];

export function Ecosystems() {
  return (
    <div className="flex gap-4 flex-col">
      <Title title="Ecosystems" />
      {/* <TooltipProvider> */}
      <div className="flex gap-4 flex-wrap">
        {ecosystemsData.map((eco) => {
          const isEnabled = eco.id === "crossfi";

          const card = (
            <div
              style={{
                backgroundColor: eco.bgColor,
                borderColor: eco.borderColor,
              }}
              className={`p-3 rounded-[32px] border w-[100px] group h-[100px] flex items-center justify-center transition-opacity duration-300 ${
                isEnabled ? "opacity-100" : "opacity-40"
              }`}
            >
              <div className="w-10 h-10 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                {eco.icon}
              </div>
            </div>
          );

          return isEnabled ? (
            <Link key={eco.id} href={`/category/${eco.id}`}>
              {card}
            </Link>
          ) : (
            //   <Tooltip key={eco.id}>
            //     <TooltipTrigger asChild>
            //       <div className="cursor-not-allowed">
            //         {card}
            //       </div>
            //     </TooltipTrigger>
            //     <TooltipContent side="top">Coming soon</TooltipContent>
            //   </Tooltip>
            <div key={eco.id}>{card}</div>
          );
        })}
      </div>
      {/* </TooltipProvider> */}
    </div>
  );
}
