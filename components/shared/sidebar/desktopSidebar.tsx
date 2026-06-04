"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { sideMenus } from "./utils";
import Image from "next/image";
import styles from "./sidebar.module.css";
import { useSidebar } from "@/components/shared/context/SidebarContext";
import { ChevronsLeft, ChevronsRight, CircleGauge } from "lucide-react";
import { cn } from "@/utils/cn";

const menuGroups = [
  {
    title: "Workspace",
    items: sideMenus.slice(0, 1),
  },
  {
    title: "Operations",
    items: sideMenus.slice(1, 6),
  },
];

export const DesktopSidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        styles.sidebar,
        isCollapsed && styles.collapsed,
        "hidden lg:flex",
      )}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 min-w-10 place-items-center rounded-lg border border-slate-200 bg-slate-50">
              <Image
                className="max-w-[30px]"
                src="/b2.png"
                alt="logo"
                width={60}
                height={60}
              />
            </div>
            <div className={cn(styles.headerText, "leading-tight")}>
              <h4 className="text-sm font-semibold tracking-wide text-slate-900">
                Work
              </h4>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Bridge
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="grid h-9 w-9 min-w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menuGroups.map((group) => (
          <div key={group.title}>
            <div className={styles.sectionLabel}>{group.title}</div>
            <div className="space-y-1">
              {group.items.map((item, index) => (
                <NavLink
                  key={`${group.title}-${index}`}
                  {...item}
                  isActive={
                    item.href === "/main"
                      ? pathname === "/main"
                      : pathname === item?.href ||
                        (item.href !== "#" && pathname.startsWith(item.href))
                  }
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerCard}>
          <div className="grid h-8 w-8 min-w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <CircleGauge className="h-4 w-4" />
          </div>
          <div className={cn(styles.footerText, "min-w-0")}>
            <p className="truncate text-xs font-semibold text-slate-700">
              WorkBridge
            </p>
            <p className="truncate text-[11px] text-emerald-600">
              Ready for operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
