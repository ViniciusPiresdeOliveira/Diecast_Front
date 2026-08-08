import api from "..";

export const getAllMinisByClient = (id: number) => {
  return api.get(`/garagem/cliente/${id}`);
};

export const deleteMiniInGarageAndReturnToSystem = (id: number) => {
  return api.delete(`/garagem/${id}/desistencia`);
};

export const deleteMiniInGarageAndSystem = (id: number) => {
  return api.delete(`/garagem/${id}/entregue`);
};
