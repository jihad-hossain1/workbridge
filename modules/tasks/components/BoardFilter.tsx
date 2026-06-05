import React, { useCallback, useEffect, useState } from "react";
import { useDataContext } from "../hooks/useDataContext";
import { debounce } from "@/utils/debounce";
import { Search } from "lucide-react";

export const BoardFilter = () => {
  const { filter, projects, updateFilter, resetFilter } = useDataContext();
  const [search, setSearch] = useState(filter.query || "");

  const debouncedUpdateSearch = useCallback(
    debounce((query: string) => {
      updateFilter({ query });
    }, 500),
    [updateFilter],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      debouncedUpdateSearch(value);
    },
    [debouncedUpdateSearch],
  );

  useEffect(() => {
    setSearch(filter.query || "");
  }, [filter.query]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-slate-100 p-4 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search task title..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-55/30 hover:bg-slate-50 transition-colors"
        />
      </div>

      {/* Project Filter */}
      <select
        value={filter.projectId || ""}
        onChange={(e) => updateFilter({ projectId: e.target.value })}
        className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      >
        <option value="">All Projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Priority Filter */}
      <select
        value={filter.priority || ""}
        onChange={(e) => updateFilter({ priority: e.target.value })}
        className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      >
        <option value="">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      {/* Clear Filters */}
      <button
        onClick={resetFilter}
        className="text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg py-2 hover:bg-blue-100 transition-all active:scale-95 duration-150"
      >
        Clear Filters
      </button>
    </div>
  );
};
