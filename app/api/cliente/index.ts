import { ClienteFormValues } from "@/app/(home)/clientes/components/ModalFormClient/validation";
import api from "..";

export const getAllClientsByTerm = (term: string) => {
  return api.get(`/cliente/search?termo=${term}`);
};

export const deleteClientById = (id: number) => {
  return api.delete(`/cliente/${id}`);
};

export const postClient = (client: ClienteFormValues) => {
  return api.post("/cliente", client);
};

export const putClient = (form: ClienteFormValues, id: number) => {
  return api.put(`/cliente/${id}`, form);
};
