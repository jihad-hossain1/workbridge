"use client";

import React, { useState } from "react";
import { Settings2 } from "lucide-react";
import { ColumnDef } from "./useClmVsb";

interface TColVsbMnu {
  columns: ColumnDef[];
  visibleColumns: Record<string, boolean>;
  onToggle: (key: string) => void;
  onReset?: () => void;
}

export const ColVsbMnu = ({
  columns,
  visibleColumns,
  onToggle,
  onReset,
}: TColVsbMnu) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Settings2 className="h-4 w-4" />
        <span>Columns</span>
      </button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-40 origin-top-right animate-scale-in">
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Toggle Columns
                </span>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Save
                </button>

                {onReset && (
                  <button
                    onClick={() => {
                      onReset();
                      window.location.reload();
                    }}
                    className="text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              {columns.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors duration-150"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns[col.key] !== false}
                    onChange={() => onToggle(col.key)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
