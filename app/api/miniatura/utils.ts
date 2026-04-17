import { mapMiniaturaPayload } from "@/app/(home)/components/ModalFormMini/utils";
import { MiniFormValues } from "@/app/(home)/components/ModalFormMini/validation";

export const buildMiniaturaFormData = (mini: MiniFormValues) => {
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

  return { formData, payload }; // payload opcional pra debug
};
