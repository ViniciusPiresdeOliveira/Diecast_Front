import api from "..";

export const getAllStatusMini = () => {
  return api.get("/status-miniatura");
};
