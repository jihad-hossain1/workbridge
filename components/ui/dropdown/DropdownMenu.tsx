"use client";

import React, { useState } from "react";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items?: {
    icon?: React.ReactNode;
    label: string;
    onClick?: () => void;
    isHide: boolean;
  }[];
  openUpwards?: boolean; // New prop to control dropdown direction
}

export const DropdownMenu = ({
  trigger,
  items = [],
  openUpwards = false,
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 animate-fade-in"
            onClick={() => {
              setIsOpen(false);
            }}
          />

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-scale-in ${
              openUpwards ? "bottom-full mb-2 origin-bottom-right" : "top-full origin-top-right"
            }`}
          >
            <div className="py-1">
              {items.map((item, index) =>
                item?.isHide ? null : (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.();
                      // setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs 2xl:text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors duration-150"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
