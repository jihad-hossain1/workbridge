import { useDataContext } from "../hooks/useDataContext";
import React, { useCallback, useEffect } from "react";
import { debounce } from "@/utils/debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button/button";

export const DataFilter = () => {
  const { updateSearch, filter, updateDateRange } = useDataContext();
  const [query, setQuery] = React.useState(filter.query || "");

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
    <div className="flex flex-col 2xl:flex-row justify-start 2xl:justify-between 2xl:items-center">
      <Input
        // key={query ?? "default_query"}
        id="data-search"
        name="data-search"
        className="w-full lg:w-[360px] 2xl:w-[400px]"
        type="text"
        onChange={(e) => handleSearchChange(e.target.value)}
        value={query}
        placeholder="Search data"
        label="Search"
      />

      <section className="flex flex-row justify-start  2xl:items-center gap-2">
        <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-2">
          <Input
            type="date"
            className="text-sm"
            id="date-search-from"
            name="date-search-from"
            label="From"
            value={filter?.fromDate as string}
            onChange={(e) => {
              updateDateRange({
                fromDate: e.target.value,
                toDate: filter?.toDate || "",
              });
            }}
          />
          <Input
            type="date"
            id="date-search-to"
            name="date-search-to"
            label="To"
            className=""
            value={filter?.toDate as string}
            onChange={(e) => {
              updateDateRange({
                fromDate: filter?.fromDate || "",
                toDate: e.target.value,
              });
            }}
          />
        </div>

        <div className="flex 2xl:flex-row justify-start 2xl:justify-between 2xl:items-center gap-5">
          {/* <div className="pt-6">
              <ResetButton />
            </div> */}
          <Button size="xs">New Project</Button>
        </div>
      </section>
    </div>
  );
};
