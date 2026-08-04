import { useContext } from "react";
import { FilterTriggerContext } from "../contexts/FilterTriggerContext";

export function useFilterTrigger() {
  const context = useContext(FilterTriggerContext);

  if (!context) {
    throw new Error(
      "useFilterTrigger deve ser usado dentro de FilterTriggerProvider",
    );
  }

  return context;
}
