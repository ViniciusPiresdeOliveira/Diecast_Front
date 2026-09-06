import { RcFile, UploadFile } from "antd/es/upload/interface";
import { EventoFormValues } from "./validation";

export const mapEventoPayload = (evento: EventoFormValues) => ({
  titulo: evento.titulo,
  descricao: evento.descricao || "",
  dataEvento: evento.data,
});

export const buildEventoFormData = (evento: EventoFormValues) => {
  const formData = new FormData();

  const files = (evento.imagens ?? [])
    .map((fileItem: UploadFile) => fileItem.originFileObj)
    .filter((file): file is RcFile => !!file);

  const payload = mapEventoPayload(evento);

  formData.append(
    "evento",
    new Blob([JSON.stringify(payload)], {
      type: "application/json",
    }),
  );

  files.forEach((file) => {
    formData.append("imagens", file);
  });

  return { formData, payload };
};
