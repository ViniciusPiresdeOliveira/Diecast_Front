"use client";

import { createContext, ReactNode, useState } from "react";

type FilterContextType = {
  amount: string;
  mark: string;
  name: string;
  year: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  handleAmount: (value: string) => void;
  handleMark: (value: string) => void;
  handleName: (value: string) => void;
  handleYear: (value: number | null) => void;
  handleMinPrice: (value: number | null) => void;
  handleMaxPrice: (value: number | null) => void;

  clearFilters: () => void;
};

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined,
);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [amount, setMount] = useState("10");
  const [name, setName] = useState("");
  const [mark, setMark] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // 🔥 Handlers semânticos
  const handleAmount = (value: string) => {
    setMount(value);
  };

  const handleMark = (value: string) => {
    setMark(value);
  };

  const handleName = (value: string) => {
    setName(value);
  };

  const handleYear = (value: number | null) => {
    setYear(value);
  };

  const handleMinPrice = (value: number | null) => {
    setMinPrice(value);
  };

  const handleMaxPrice = (value: number | null) => {
    setMaxPrice(value);
  };

  const clearFilters = () => {
    setMark("");
    setName("");
    setYear(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  return (
    <FilterContext.Provider
      value={{
        amount,
        mark,
        name,
        year,
        minPrice,
        maxPrice,
        handleMark,
        handleName,
        handleYear,
        handleMinPrice,
        handleMaxPrice,
        handleAmount,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
