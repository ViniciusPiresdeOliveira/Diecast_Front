import api from "..";
import { Cliente } from "./types";

export const getAllClientsByTerm = (term: string) => {
  return api.get(`/cliente/search?termo=${term}`);
};

export const deleteClientById = (id: number) => {
  return api.delete(`/cliente/${id}`);
};

export const postClients = (condition: Cliente) => {
  return api.post("/cliente", condition);
};
