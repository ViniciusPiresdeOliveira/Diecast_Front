import { GenericPostTypes } from "@/app/types";
import api from "..";

export const getAllTypesMini = () => {
  return api.get("/tipos-miniatura");
};

export const deleteTypesMiniById = (id: number) => {
  return api.delete(`/tipos-miniatura/${id}`);
};

export const postTypesMini = (type: GenericPostTypes) => {
  return api.post("/tipos-miniatura", type);
};
