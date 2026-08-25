import api from "..";

export const fetchLogout = () => {
  return api.post("/auth/logout");
};
