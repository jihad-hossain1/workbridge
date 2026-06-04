"use client";

import { Button } from "../button/button";
import { icons } from "../icons";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  pageSize?: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const pageSizeOptions = [
  { text: "10 / page", value: "10" },
  { text: "20 / page", value: "20" },
  { text: "50 / page", value: "50" },
  { text: "100 / page", value: "100" },
  { text: "200 / page", value: "200" },
];

export const Pagination = ({
  currentPage,
  totalPage,
  pageSize = 10,
  disabled = false,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const generatePagination = () => {
    if (totalPage <= 7) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    const newPages: (number | string)[] = [1];

    if (currentPage <= 3) {
      newPages.push(2, 3, 4, "...");
    } else if (currentPage >= totalPage - 2) {
      newPages.push("...", totalPage - 3, totalPage - 2, totalPage - 1);
    } else {
      newPages.push(
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
      );
    }

    newPages.push(totalPage);
    return newPages;
  };

  const pages = generatePagination();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {/* Page size selector + info */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <select
          className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-blue-200 focus:ring-1 focus:ring-blue-200"
          value={pageSize?.toString()}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <span className="hidden sm:inline">
          Page {currentPage} of {totalPage}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <Button
          button_color="outline"
          size="xs"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="gap-1"
        >
          <icons.arrowDown className="h-3 w-3 rotate-90" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {/* Page numbers - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((page, index) =>
            typeof page === "number" ? (
              <Button
                key={index}
                button_color={currentPage === page ? "primary" : "outline"}
                size="xs"
                disabled={disabled}
                onClick={() => onPageChange(page)}
                className="w-8 px-0"
              >
                {page}
              </Button>
            ) : (
              <span
                key={index}
                className="px-1 text-xs text-slate-400 select-none"
              >
                ...
              </span>
            ),
          )}
        </div>

        {/* Mobile page indicator */}
        <span className="sm:hidden text-xs font-medium text-slate-600 px-2">
          {currentPage} / {totalPage}
        </span>

        <Button
          button_color="outline"
          size="xs"
          disabled={disabled || currentPage >= totalPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <icons.arrowDown className="h-3 w-3 -rotate-90" />
        </Button>
      </div>
    </div>
  );
};

Pagination.displayName = "Pagination";
