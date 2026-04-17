import { mapMiniaturaPayload } from "@/app/(home)/components/ModalFormMini/utils";
import { MiniFormValues } from "@/app/(home)/components/ModalFormMini/validation";
import api from "..";
import { FilterMiniatura } from "./types";

export const getFilterMiniatura = (filters: FilterMiniatura) => {
  return api.post("/miniaturas/filtro", filters);
};

export const getMiniById = (id: number) => {
  return api.get(`/miniaturas/${id}`);
};

export const deleteMiniById = (id: number) => {
  return api.delete(`/miniaturas/${id}`);
};

export const postMiniatura = (mini: MiniFormValues) => {
  const formData = new FormData();

  const file = mini.image?.[0]?.originFileObj;

  const payload = mapMiniaturaPayload(mini);

  formData.append(
    "miniatura",
    new Blob([JSON.stringify(payload)], {
      type: "application/json",
    }),
  );

  if (file) {
    formData.append("imagem", file);
  }

  return api.post("/miniaturas", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
