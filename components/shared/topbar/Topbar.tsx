"use client";

import React from "react";
import { icons } from "@/components/ui/icons";
import { useSidebar } from "../context/SidebarContext";
import { DropdownMenu } from "@/components/ui/dropdown/DropdownMenu";
import { signout } from "@/modules/auth/actions/authActions";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const TopBar = () => {
  const { isCollapsed } = useSidebar();
  const { logoutUser } = useAuthStore();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    // Clear localStorage first to ensure it's removed
    localStorage.removeItem("_auth_b2c_user_");

    // Dispatch logout action (this also clears localStorage but we do it above as backup)
    logoutUser();

    // Set logging out state to true
    setIsLoggingOut(true);

    try {
      // Clear server-side cookies
      const response = await signout();

      if (response.success) {
        // Navigate to login page
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", (error as Error).message);
    } finally {
      // Set logging out state to false regardless of success or failure
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={cn(
        "xl:bg-white xl:dark:bg-slate-900 xl:border-b xl:border-gray-200 xl:dark:border-slate-800 h-14 2xl:h-16 fixed right-0 top-0 z-30 transition-[left] duration-300 ease-in-out xl:shadow-sm",
        isCollapsed ? "lg:left-[80px]" : "lg:left-[260px]"
      )}
    >
      <div className="px-4 h-full flex items-center justify-between">
        {/* Mobile Menu Button */}
        {/* <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <icons.menu className="h-5 w-5 text-gray-600" />
        </button> */}

        {/* Search Bar */}
        <div className="flex-1 max-w-xl ml-4 lg:ml-0 hidden md:block">
          {/* <div className="relative">
            <icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="text-sm 2xl:text-base w-full pl-8 2xl:pl-10 pr-4 py-1 2xl:py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            />
          </div> */}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-105 text-gray-600 dark:text-slate-400 flex items-center justify-center"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-500 fill-amber-500/10" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </button>

          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-105">
            <icons.bell className="h-5 w-5 text-gray-600 dark:text-slate-400" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          <DropdownMenu
            trigger={
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-105">
                <div className="2xl:h-8 2xl:w-8 h-6 w-6 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center">
                  <icons.user className="h-4 w-4 2xl:h-5 2xl:w-5 text-gray-600 dark:text-slate-450" />
                </div>
                <span className="text-xs 2xl:text-sm font-normal 2xl:font-medium text-gray-700 dark:text-slate-300 hidden sm:block">
                  Profile
                </span>
              </button>
            }
            items={[
              {
                icon: <icons.user className="h-4 w-4" />,
                label: "My Profile",
                onClick: () => (window.location.href = "/main/profile"),
                isHide: false,
              },
              {
                icon: <icons.settings className="h-4 w-4" />,
                label: "Settings",
                onClick: () => (window.location.href = "/main/settings"),
                isHide: false,
              },
              {
                icon: isLoggingOut ? (
                  <icons.loader className="mr-2 animate-spin h-4 w-4 2xl:h-5 2xl:w-5" />
                ) : (
                  <icons.logout className="h-4 w-4" />
                ),
                label: isLoggingOut ? "Signing Out..." : "Sign Out",
                onClick: handleLogout,
                isHide: false,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
