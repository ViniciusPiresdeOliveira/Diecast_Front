import { UploadFile } from "antd";
import * as yup from "yup";

export const miniSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  brand: yup.string().required("Marca é obrigatória"),
  year: yup
    .number()
    .typeError("Ano deve ser um número")
    .required("Ano é obrigatório")
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear(), "Ano inválido"),
  types: yup.array().of(yup.string()).min(1, "Selecione ao menos um tipo"),
  line: yup.string().required("Linha é obrigatória"),
  price: yup
    .number()
    .typeError("Preço deve ser um número")
    .required("Preço é obrigatório")
    .min(0, "Não pode ser negativo"),
  stock: yup
    .number()
    .typeError("Estoque deve ser um número")
    .required("Estoque é obrigatório")
    .min(1, "Tem que ser no mínimo 1"),
  status: yup.string().required("Status é obrigatório"),
  scale: yup.string().required("Escala é obrigatória"),
  image: yup
    .array()
    .of(yup.mixed<UploadFile>().required())
    .min(1, "Imagem é obrigatória")
    .required(),
});

export type MiniFormValues = yup.InferType<typeof miniSchema>;
