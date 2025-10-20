"use client";

import React from "react";
import { useActivityCenterStore } from "../statusbar/state";
import { LatestActivity } from "@/modules/home/components/latest-activity";
import { useWindowSize } from "@uidotdev/usehooks";
import { motion, AnimatePresence } from "framer-motion";

export function LatestActivityMobile() {
  const { width } = useWindowSize();
  const isSmallScreen = width && width <= 1249;
  const { isOpen } = useActivityCenterStore();
  const showActivity = isSmallScreen && isOpen;

  return (
    <>
      <AnimatePresence>
        {showActivity && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-16 md:right-6 left-4 right-4 w-full max-w-[320px] z-50 shadow-md"
          >
            <LatestActivity />

          </motion.div>
        )}
      </AnimatePresence> 
    </>
  );
}
