import api from "..";

export const getAllLinesMini = () => {
  return api.get("/linhas-miniatura");
};
