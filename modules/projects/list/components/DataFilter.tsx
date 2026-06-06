import { useDataContext } from "../hooks/useDataContext";
import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "@/utils/debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog/dialog";
import { X, Search, Plus } from "lucide-react";
import { Manage } from "../../new/manage";

interface DataFilterProps {
  refetch?: () => void;
}

export const DataFilter = ({ refetch }: DataFilterProps) => {
  const { updateSearch, filter, setStatusFilter } = useDataContext();
  const [query, setQuery] = useState(filter.query || "");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const debouncedUpdateSearch = useCallback(
    debounce((query: string) => {
      updateSearch(query);
    }, 500),
    [updateSearch],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);
      debouncedUpdateSearch(value);
    },
    [debouncedUpdateSearch],
  );

  useEffect(() => {
    setQuery(filter?.query || "");
  }, [filter?.query]);

  const activeStatus = filter?.status || "ACTIVE";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
      {/* Left side: Search input */}
      <div className="w-full md:max-w-xs lg:w-[320px]">
        <Input
          id="data-search"
          name="data-search"
          type="text"
          onChange={(e) => handleSearchChange(e.target.value)}
          value={query}
          placeholder="Search projects by name or code..."
          leftIcon={<Search className="h-4 w-4 text-slate-400" />}
          className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 py-1.5 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 transition-all duration-200"
        />
      </div>

      {/* Right side: Tabs filter and CTA button */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Tab filters */}
        <div className="bg-slate-100/80 dark:bg-slate-950 p-0.5 rounded-lg flex items-center gap-1 border border-slate-200/40 dark:border-slate-800">
          {["ACTIVE", "ARCHIVED", "ALL"].map((status) => {
            const isActive = activeStatus === status;
            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-800"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-900/40"
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm"
          button_color="primary"
          icon={<Plus className="h-3.5 w-3.5" />}
        >
          New Project
        </Button>
      </div>

      {/* Create Project Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl mx-auto p-0 rounded-xl overflow-hidden">
          <DialogClose className="absolute right-4 top-4 z-10">
            <X className="text-slate-450 hover:text-slate-700 h-4 w-4 transition-colors" />
          </DialogClose>
          <Manage
            refetch={() => {
              refetch?.();
              setIsCreateOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
