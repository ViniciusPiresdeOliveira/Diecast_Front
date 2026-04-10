import api from "..";

export const getAllScalesMini = () => {
  return api.get("/escalas-miniatura");
};
