"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarLinkItem, sidebarLinks } from ".";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMobileNavStore } from "../statusbar/state";

export function MobileNav() {
  const { width } = useWindowSize();
  const isSmallScreen = width && width <= 1249;
  const { isOpen } = useMobileNavStore();
  const showMobileNav = isSmallScreen && isOpen;
  const pathname = usePathname();
  const isRouteActive = React.useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/"; // only exact root
      // match the exact href OR any deeper segment under it
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname]
  );
  return (
    <AnimatePresence>
      {showMobileNav && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="flex flex-col gap-2 fixed top-16 bg-secondary border border-border rounded-xl md:right-6 left-4 right-4 w-full max-w-[320px] z-50 shadow-md py-5"
        >
          {sidebarLinks.map((link) => {
            return (
              <SidebarLinkItem
                key={link.href}
                label={link.label}
                href={link.href}
                icon={link.icon}
                isActive={isRouteActive(link.href)}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
