import { MiniFormValues } from "@/app/(home)/components/ModalFormMini/validation";
import api from "..";
import { FilterMiniatura } from "./types";
import { buildMiniaturaFormData } from "./utils";

export const getFilterMiniatura = (filters: FilterMiniatura) => {
  return api.post("/miniaturas/filtro", filters);
};

export const getMiniById = (id: number) => {
  return api.get(`/miniaturas/${id}`);
};

export const deleteMiniById = (id: number) => {
  return api.delete(`/miniaturas/${id}`);
};

export const putMiniatura = (mini: MiniFormValues, idMini: number) => {
  const { formData } = buildMiniaturaFormData(mini);

  return api.put(`/miniaturas/${idMini}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const postMiniatura = (mini: MiniFormValues) => {
  const { formData } = buildMiniaturaFormData(mini);

  return api.post("/miniaturas", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
