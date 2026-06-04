"use client";

import { useState, useEffect, useCallback } from "react";

export interface ColumnDef {
  key: string;
  label: string;
  defaultVisible?: boolean;
}

export const useClmVsb = (storageKey: string, columns: ColumnDef[]) => {
  const getDefaultVisibility = (): Record<string, boolean> => {
    const visibility: Record<string, boolean> = {};
    columns.forEach((col) => {
      visibility[col.key] = col.defaultVisible !== false;
    });
    return visibility;
  };

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () => {
      if (typeof window === "undefined") return getDefaultVisibility();
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Merge with defaults to handle new columns added later
          const defaults = getDefaultVisibility();
          return { ...defaults, ...parsed };
        }
      } catch {
        // ignore parse errors
      }
      return getDefaultVisibility();
    },
  );

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
    } catch {
      // ignore storage errors
    }
  }, [storageKey, visibleColumns]);

  const toggleColumn = useCallback((key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const isVisible = useCallback(
    (key: string) => {
      return visibleColumns[key] !== false;
    },
    [visibleColumns],
  );

  const resetToDefaults = useCallback(() => {
    setVisibleColumns(getDefaultVisibility());
  }, [columns]);

  return { visibleColumns, toggleColumn, isVisible, resetToDefaults };
};
