"use client";
import Link from "next/link";
import React from "react";
import Logo from "@/assets/svg/logo.svg";
import Discover from "@/assets/svg/nav/discover.svg";
import Dashboard from "@/assets/svg/nav/dashboard.svg";
import Learning from "@/assets/svg/nav/learning.svg";
import Trade from "@/assets/svg/nav/Trade.svg";
import { cn } from "@/utils";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-[calc(100vh-3rem)] sticky bg-secondary border border-border rounded-3xl flex flex-col">
      <div className="p-5">
        <Link
          href="/"
          className="flex items-center gap-3 border-b border-border pb-6 mb-5"
        >
          <Logo className="size-6" />
          <p className="font-medium text-white">DecentraLearn</p>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {sidebarLinks.map((link) => {
          return (
            <SidebarLinkItem
              key={link.href}
              label={link.label}
              href={link.href}
              icon={link.icon}
              isActive={pathname === link.href}
            />
          );
        })}
      </div>
    </aside>
  );
}

const sidebarLinks = [
  {
    label: "Discover",
    href: "/",
    icon: Discover,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Dashboard,
  },
  {
    label: "Learning",
    href: "/learning",
    icon: Learning,
  },
  {
    label: "Trade",
    href: "/trade",
    icon: Trade,
  },
];
type SidebarLinkProps = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
};
function SidebarLinkItem({
  label,
  href,
  icon: Icon,
  isActive,
}: SidebarLinkProps) {
  return (
    <div className="relative px-5 group">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 py-2 px-3 rounded-lg relative transition-colors duration-200",
          {
            "text-accent bg-dark-accent/50": isActive,
            "hover:text-accent hover:bg-dark-accent/50": !isActive,
          }
        )}
      >
        <Icon
          className={cn("size-5 text-muted transition-colors duration-200", {
            "text-accent": isActive,
            "group-hover:text-accent": !isActive,
          })}
        />
        <span className="font-medium">{label}</span>
      </Link>
      {isActive && (
        <div className="absolute inset-y-0 left-0 w-1 bg-accent rounded-tr-lg rounded-br-lg" />
      )}
    </div>
  );
}
