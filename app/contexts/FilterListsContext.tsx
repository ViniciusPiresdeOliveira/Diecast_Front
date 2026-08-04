"use client";

import { createContext, ReactNode, useState } from "react";
import { FilterLists } from "../(home)/components/Filter/types";

interface FilterListsContextData {
  filterLists: FilterLists;
  handleChangeFilterLists: (data: Partial<FilterLists>) => void;
}

const initialFilterLists: FilterLists = {
  marks: [],
  types: [],
  lines: [],
  conditions: [],
  scales: [],
};

export const FilterListsContext = createContext<
  FilterListsContextData | undefined
>(undefined);

export function FilterListsProvider({ children }: { children: ReactNode }) {
  const [filterLists, setFilterLists] =
    useState<FilterLists>(initialFilterLists);

  const handleChangeFilterLists = (data: Partial<FilterLists>) => {
    setFilterLists((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <FilterListsContext.Provider
      value={{ filterLists, handleChangeFilterLists }}
    >
      {children}
    </FilterListsContext.Provider>
  );
}
