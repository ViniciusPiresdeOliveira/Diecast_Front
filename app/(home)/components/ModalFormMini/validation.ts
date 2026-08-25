import { UploadFile } from "antd";
import * as yup from "yup";

export const miniSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  brand: yup.string().required("Marca é obrigatório"),
  year: yup
    .number()
    .typeError("Ano deve ser um número")
    .required("Ano é obrigatório")
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear(), "Ano inválido"),
  types: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione ao menos um tipo")
    .required("Tipo é obrigatório"),
  line: yup.string().required("Linha é obrigatório"),
  price: yup
    .number()
    .typeError("Preço deve ser um número")
    .required("Preço é obrigatório")
    .min(0, "Não pode ser negativo"),
  stockQty: yup
    .number()
    .typeError("Quantidade em estoque deve ser um número")
    .required("Quantidade em estoque é obrigatória")
    .min(1, "Tem que ser no mínimo 1"),

  availableQty: yup
    .number()
    .typeError("Quantidade disponível deve ser um número")
    .required("Quantidade disponível é obrigatória")
    .min(0, "Não pode ser negativo"),

  garageQty: yup
    .number()
    .typeError("Quantidade na garagem deve ser um número")
    .required("Quantidade na garagem é obrigatória")
    .min(0, "Não pode ser negativo"),
  condition: yup.string().required("Condição é obrigatório"),
  scale: yup.string().required("Escala é obrigatório"),
  image: yup
    .array()
    .of(yup.mixed<UploadFile>().required())
    .min(1, "Imagem é obrigatório")
    .required("Imagem é obrigatório"),
});

export type MiniFormValues = yup.InferType<typeof miniSchema>;
