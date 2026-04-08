"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { PaginationDefault } from "../(home)/utils";

type FilterContextType = {
  amount: number;
  type: string[] | null;
  mark: string[] | null;
  line: string[] | null;
  status: string[] | null;
  scale: string[] | null;
  name: string;
  year: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  handleAmount: (value: number) => void;
  handleMark: (value: string[]) => void;
  handleType: (value: string[]) => void;
  handleStatus: (value: string[]) => void;
  handleScale: (value: string[]) => void;
  handleLine: (value: string[]) => void;
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
  const [amount, setMount] = useState(PaginationDefault.elementsPerPage);
  const [name, setName] = useState("");
  const [mark, setMark] = useState<string[] | null>(null);
  const [status, setStatus] = useState<string[] | null>(null);
  const [scale, setScale] = useState<string[] | null>(null);
  const [line, setLine] = useState<string[] | null>(null);
  const [type, setType] = useState<string[] | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const handleAmount = useCallback((value: number) => {
    setMount(value);
  }, []);

  const handleStatus = useCallback((value: string[]) => {
    setStatus(value);
  }, []);

  const handleScale = useCallback((value: string[]) => {
    setScale(value);
  }, []);

  const handleType = useCallback((value: string[]) => {
    setType(value);
  }, []);

  const handleLine = useCallback((value: string[]) => {
    setLine(value);
  }, []);

  const handleMark = useCallback((value: string[]) => {
    setMark(value);
  }, []);

  const handleName = useCallback((value: string) => {
    setName(value);
  }, []);

  const handleYear = useCallback((value: number | null) => {
    setYear(value);
  }, []);

  const handleMinPrice = useCallback((value: number | null) => {
    setMinPrice(value);
  }, []);

  const handleMaxPrice = useCallback((value: number | null) => {
    setMaxPrice(value);
  }, []);

  const clearFilters = useCallback(() => {
    setMark([""]);
    setName("");
    setType([""]);
    setLine([""]);
    setYear(null);
    setMinPrice(null);
    setMaxPrice(null);
  }, []);

  const values = useMemo(
    () => ({
      amount,
      mark,
      type,
      name,
      year,
      minPrice,
      maxPrice,
      line,
      status,
      scale,
      handleMark,
      handleLine,
      handleName,
      handleType,
      handleYear,
      handleMinPrice,
      handleMaxPrice,
      handleAmount,
      handleStatus,
      handleScale,
      clearFilters,
    }),
    [
      amount,
      mark,
      type,
      name,
      year,
      minPrice,
      maxPrice,
      line,
      status,
      scale,
      handleMark,
      handleLine,
      handleName,
      handleType,
      handleYear,
      handleMinPrice,
      handleMaxPrice,
      handleAmount,
      handleStatus,
      handleScale,
      clearFilters,
    ],
  );

  return (
    <FilterContext.Provider value={values}>{children}</FilterContext.Provider>
  );
};
