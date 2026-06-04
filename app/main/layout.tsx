"use client";

import {
  SidebarProvider,
  useSidebar,
} from "@/components/shared/context/SidebarContext";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { TopBar } from "@/components/shared/topbar/Topbar";
import { cn } from "@/utils/cn";

type IProps = {
  children: React.ReactNode;
};

const DashboardContent = (props: IProps) => {
  const { children } = props;
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-50">
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
          <div className="space-y-4 2xl:space-y-5">{children}</div>
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
