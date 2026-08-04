import { useContext } from "react";
import { FilterListsContext } from "../contexts/FilterListsContext";

export function useFilterLists() {
  const context = useContext(FilterListsContext);

  if (!context) {
    throw new Error(
      "useFilterLists deve ser usado dentro de FilterListsProvider",
    );
  }

  return context;
}
