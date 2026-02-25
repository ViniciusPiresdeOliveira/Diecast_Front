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
  line: yup.string().nullable(),
  salePrice: yup
    .number()
    .typeError("Preço de venda deve ser um número")
    .required("Preço de venda é obrigatório")
    .min(0, "Não pode ser negativo"),
  costPrice: yup
    .number()
    .typeError("Preço de custo deve ser um número")
    .required("Preço de custo é obrigatório")
    .min(0, "Não pode ser negativo"),
  stock: yup
    .number()
    .typeError("Estoque deve ser um número")
    .required("Estoque é obrigatório")
    .min(0, "Não pode ser negativo"),
  scale: yup.string().nullable(),
  weight: yup.number().nullable(),
  volume: yup.number().nullable(),
  status: yup.boolean().required(),
});

export type MiniFormValues = yup.InferType<typeof miniSchema>;
