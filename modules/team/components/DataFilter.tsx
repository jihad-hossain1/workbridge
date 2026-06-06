import { useDataContext } from "../hooks/useDataContext";
import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "@/utils/debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DataFilterProps {
  refetch?: () => void;
}

export const DataFilter = ({ refetch }: DataFilterProps) => {
  const { updateSearch, filter } = useDataContext();
  const [query, setQuery] = useState(filter.query || "");

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
    </div>
  );
};
