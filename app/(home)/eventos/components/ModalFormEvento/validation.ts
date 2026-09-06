import * as yup from "yup";
import { UploadFile } from "antd/es/upload/interface";

export const eventSchema = yup.object({
  titulo: yup
    .string()
    .trim()
    .required("Informe o título do evento")
    .max(255, "O título deve ter no máximo 255 caracteres"),
  data: yup.string().required("Informe a data do evento"),
  descricao: yup
    .string()
    .trim()
    .max(2000, "A descrição deve ter no máximo 2000 caracteres")
    .default(""),
  imagens: yup
    .array()
    .of(yup.mixed<UploadFile>().required())
    .min(1, "Adicione ao menos uma imagem")
    .required("Adicione ao menos uma imagem"),
});

export type EventoFormValues = yup.InferType<typeof eventSchema>;
