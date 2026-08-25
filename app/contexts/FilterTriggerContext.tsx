"use client";

import { createContext, ReactNode, useState } from "react";

interface FilterTriggerContextData {
  filterTrigger: number;
  triggerFilter: () => void;
}

export const FilterTriggerContext = createContext<
  FilterTriggerContextData | undefined
>(undefined);

export function FilterTriggerProvider({ children }: { children: ReactNode }) {
  const [filterTrigger, setFilterTrigger] = useState(0);

  const triggerFilter = () => {
    setFilterTrigger((prev) => prev + 1);
  };

  return (
    <FilterTriggerContext.Provider value={{ filterTrigger, triggerFilter }}>
      {children}
    </FilterTriggerContext.Provider>
  );
}
