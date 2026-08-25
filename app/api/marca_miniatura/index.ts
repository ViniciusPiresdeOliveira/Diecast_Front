import { GenericPostTypes } from "@/app/types";
import api from "..";

export const getAllMarksMini = () => {
  return api.get("/marcas-miniatura");
};

export const deleteMarkMiniById = (id: number) => {
  return api.delete(`/marcas-miniatura/${id}`);
};

export const postMarkMini = (mark: GenericPostTypes) => {
  return api.post("/marcas-miniatura", mark);
};
