"use client";

import {
  SidebarProvider,
  useSidebar,
} from "@/components/shared/context/SidebarContext";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { TopBar } from "@/components/shared/topbar/Topbar";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";

type IProps = {
  children: React.ReactNode;
  stats?: React.ReactNode;
  charts?: React.ReactNode;
  progress?: React.ReactNode;
  activities?: React.ReactNode;
};

const DashboardContent = (props: IProps) => {
  const { children, stats, charts, progress, activities } = props;
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const isDashboard = pathname === "/main" || pathname === "/main/";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main
          className={cn(
            "flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 2xl:p-5 transition-[margin] duration-300 ease-in-out",
            isCollapsed ? "lg:ml-[76px]" : "lg:ml-[272px]",
            "mt-[64px]",
          )}
        >
          {isDashboard ? (
            <div className="space-y-6">
              {children}
              {stats}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {progress}
                {activities}
              </div>
            </div>
          ) : (
            <div className="space-y-4 2xl:space-y-5">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default function DashboardLayout(props: any) {
  return (
    <SidebarProvider>
      <DashboardContent {...props} />
    </SidebarProvider>
  );
}
