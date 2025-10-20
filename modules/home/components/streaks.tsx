import { Title } from "@/modules/app";
import React from "react";

export function Streaks() {
  return (
    <div className="relative">
      <Title title="Streaks" className="mb-4" />
      <div className="relative w-full h-[300px]">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-20 rounded-3xl">
          <p className="text-accent text-lg font-semibold">Coming Soon!</p>
        </div>
      </div>
    </div>
  );
}
