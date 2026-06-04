"use client";

import React from "react";
import { icons } from "@/components/ui/icons";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { sideMenus } from "./utils";
import { useSidebar } from "../context/SidebarContext";
import Image from "next/image";
import { CircleGauge, Search } from "lucide-react";

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

export const MobileSidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute left-0 grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95 lg:hidden"
      >
        <icons.menu className="h-6 w-6" />
      </button>
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-[min(88vw,340px)] border-r border-slate-200 bg-white shadow-2xl animate-slide-in-left lg:hidden">
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 animate-sidebar-item-in">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-slate-50">
                    <Image
                      src="/b2.png"
                      className="max-w-[32px]"
                      alt="logo"
                      width={70}
                      height={70}
                    />
                  </div>
                  <div className="leading-tight">
                    <h4 className="text-sm font-semibold tracking-wide text-slate-900">
                      WorkBridge
                    </h4>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      WorkBridge Console
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                >
                  <icons.close className="h-5 w-5" />
                </button>
              </div>

              <div className="border-b border-slate-100 px-4 py-3 animate-sidebar-item-in [animation-delay:50ms]">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  <Search className="h-4 w-4" />
                  <span className="truncate">Navigate modules</span>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-3 animate-sidebar-item-in [animation-delay:80ms]">
                {menuGroups.map((group, groupIndex) => (
                  <div key={group.title} className="pb-2">
                    <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {group.title}
                    </p>
                    <ul className="space-y-1">
                      {group.items.map((item, index) => (
                        <li
                          key={`${group.title}-${index}`}
                          className="animate-sidebar-item-in transition-transform duration-200 active:scale-[0.99]"
                          style={{
                            animationDelay: `${
                              120 + groupIndex * 50 + index * 30
                            }ms`,
                          }}
                        >
                          <NavLink
                            {...item}
                            isActive={
                              item.href === "/main"
                                ? pathname === "/main"
                                : pathname === item?.href ||
                                  (item.href !== "#" &&
                                    pathname.startsWith(item.href))
                            }
                            onClick={() => setIsSidebarOpen(false)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              <div className="border-t border-slate-200 p-4 animate-sidebar-item-in [animation-delay:180ms]">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CircleGauge className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      WorkBridge
                    </p>
                    <p className="truncate text-xs text-emerald-600">
                      Ready for operations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
