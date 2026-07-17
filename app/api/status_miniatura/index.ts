import { GenericPostTypes } from "@/app/types";
import api from "..";

export const getAllStatusMini = () => {
  return api.get("/condicao-miniatura");
};

export const deleteStatusMiniById = (id: number) => {
  return api.delete(`/condicao-miniatura/${id}`);
};

export const postStatusMini = (status: GenericPostTypes) => {
  return api.post("/condicao-miniatura", status);
};
