import { GenericPostTypes } from "@/app/types";
import api from "..";

export const getAllStatusMini = () => {
  return api.get("/status-miniatura");
};

export const deleteStatusMiniById = (id: number) => {
  return api.delete(`/status-miniatura/${id}`);
};

export const postStatusMini = (status: GenericPostTypes) => {
  return api.post("/status-miniatura", status);
};
