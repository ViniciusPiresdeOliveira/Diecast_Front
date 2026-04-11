import { GenericPostTypes } from "@/app/types";
import api from "..";

export const getAllLinesMini = () => {
  return api.get("/linhas-miniatura");
};

export const deleteLineMiniById = (id: number) => {
  return api.delete(`/linhas-miniatura/${id}`);
};

export const postLineMini = (line: GenericPostTypes) => {
  return api.post("/linhas-miniatura", line);
};
