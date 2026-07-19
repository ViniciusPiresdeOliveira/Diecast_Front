import { MiniFormValues } from "@/app/(home)/components/ModalFormMini/validation";
import api from "..";
import { FilterMiniatura } from "./types";
import { buildMiniaturaFormData } from "./utils";

export const getFilterMiniatura = (filters: FilterMiniatura) => {
  return api.post("/miniaturas/filtro", filters);
};

export const getSimilarMiniaturesById = (id: number, limit = 15) => {
  return api.get(`/miniaturas/similares/${id}`, {
    params: { limit },
  });
};

export const getMiniImageById = (id: number) => {
  return api.get(`/miniaturas/${id}/imagem`, { responseType: "blob" });
};

export const getMiniById = (id: number) => {
  return api.get(`/miniaturas/${id}`);
};

export const deleteMiniById = (id: number) => {
  return api.delete(`/miniaturas/${id}`);
};

export const putMiniatura = (mini: MiniFormValues, idMini: number) => {
  const { formData } = buildMiniaturaFormData(mini, false);

  return api.put(`/miniaturas/${idMini}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const postMiniatura = (mini: MiniFormValues) => {
  const { formData } = buildMiniaturaFormData(mini, true);

  return api.post("/miniaturas", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
