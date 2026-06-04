"use client";

import React from "react";
import { DesktopSidebar } from "./desktopSidebar";
import { MobileSidebar } from "./mobileSidebar";

const Sidebar = () => {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
      <div className="block lg:hidden relative">
        <MobileSidebar />
      </div>
    </>
  );
};

export default Sidebar;
