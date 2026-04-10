import api from "..";

export const getAllTypesMini = () => {
  return api.get("/tipos-miniatura");
};
