import api from "..";
import { FilterMiniatura } from "./types";

export const getFilterMiniatura = (filters: FilterMiniatura) => {
  return api.post("/miniaturas/filtro", filters);
};
