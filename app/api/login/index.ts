import api from "..";
import { UserLogin } from "./types";

export const fetchLogin = (user: UserLogin) => {
  return api.post("/auth/login", user);
};

export const getAuthMe = () => {
  return api.get("/auth/me");
};
