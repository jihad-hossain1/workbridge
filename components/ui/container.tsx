"use client";

import React from "react";

import { BreadCrumbs } from "./BreadCrumbs";
import { cn } from "@/utils/cn";

export const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="w-full min-h-screen">
      <BreadCrumbs />
      <div
        className={cn(
          "bg-white border border-gray-100 rounded-lg p-2 shadow-sm",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
