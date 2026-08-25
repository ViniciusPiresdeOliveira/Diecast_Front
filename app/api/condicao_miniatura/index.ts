import { GenericPostTypes } from "@/app/types";
import api from "..";

export const getAllConditionMini = () => {
  return api.get("/condicao-miniatura");
};

export const deleteConditionMiniById = (id: number) => {
  return api.delete(`/condicao-miniatura/${id}`);
};

export const postConditionMini = (condition: GenericPostTypes) => {
  return api.post("/condicao-miniatura", condition);
};
