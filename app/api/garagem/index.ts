import api from "..";

export const getAllMinisByClient = (id: number) => {
  return api.get(`/garagem/cliente/${id}`);
};
