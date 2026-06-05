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
// import { Manage } from "../../new/manage";

interface DataFilterProps {
  refetch?: () => void;
}

export const DataFilter = ({ refetch }: DataFilterProps) => {
  const { updateSearch, filter } = useDataContext();
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

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 bg-white p-4 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
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
          className="w-full bg-slate-50 border-slate-200/60 rounded-lg text-slate-800 placeholder:text-slate-400 py-1.5 focus:bg-white focus:border-blue-500 transition-all duration-200"
        />
      </div>

      {/* Create Project Modal */}
      {/* <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
      </Dialog> */}
    </div>
  );
};
