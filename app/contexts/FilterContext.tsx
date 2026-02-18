"use client";

import { createContext, ReactNode, useState } from "react";

type FilterContextType = {
  filterName: string;
  filterYear: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  handleFilterName: (value: string) => void;
  handleFilterYear: (value: number | null) => void;
  handleMinPrice: (value: number | null) => void;
  handleMaxPrice: (value: number | null) => void;

  clearFilters: () => void;
};

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined,
);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterName, setFilterName] = useState("");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // 🔥 Handlers semânticos
  const handleFilterName = (value: string) => {
    setFilterName(value);
  };

  const handleFilterYear = (value: number | null) => {
    setFilterYear(value);
  };

  const handleMinPrice = (value: number | null) => {
    setMinPrice(value);
  };

  const handleMaxPrice = (value: number | null) => {
    setMaxPrice(value);
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterYear(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  return (
    <FilterContext.Provider
      value={{
        filterName,
        filterYear,
        minPrice,
        maxPrice,
        handleFilterName,
        handleFilterYear,
        handleMinPrice,
        handleMaxPrice,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
