import api from "..";

export const getAllMarksMini = () => {
  return api.get("/marcas-miniatura");
};
