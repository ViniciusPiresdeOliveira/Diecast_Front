import { GenericPostTypes } from "@/app/types";
import api from "..";

export const getAllScalesMini = () => {
  return api.get("/escalas-miniatura");
};

export const deleteScaleMiniById = (id: number) => {
  return api.delete(`/escalas-miniatura/${id}`);
};

export const postScaleMini = (scale: GenericPostTypes) => {
  return api.post("/escalas-miniatura", scale);
};
