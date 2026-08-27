import api from "..";
import { PostMiniInGarageDTO } from "./types";

export const getAllMinisByClient = (id: number) => {
  return api.get(`/garagem/cliente/${id}`);
};

export const postMiniInGarage = (data: PostMiniInGarageDTO) => {
  return api.post(`/garagem`, data);
};
export const deleteMiniInGarageAndReturnToSystem = (id: number) => {
  return api.delete(`/garagem/${id}/desistencia`);
};

export const deleteMiniInGarageAndSystem = (id: number) => {
  return api.delete(`/garagem/${id}/entregue`);
};
