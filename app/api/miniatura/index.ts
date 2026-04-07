import api from "..";

export const getFilterMiniatura = (filters: any) => {
  return api.post("/miniaturas/filtro", filters);
};
