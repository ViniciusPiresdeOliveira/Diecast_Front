import * as yup from "yup";

export const clienteSchema = yup.object({
  nome: yup.string().required("Nome é obrigatório").default(""),
  telefone: yup
    .string()
    .required("Telefone é obrigatório")
    .default("")
    .test("telefone-valido", "Telefone inválido", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 10 || digits.length === 11;
    }),
  cep: yup
    .string()
    .default("")
    .test("cep-valido", "Cep inválido", (value) => {
      if (!value) return true; // opcional
      const digits = value.replace(/\D/g, "");
      return digits.length === 8;
    }),
  numeroResidencia: yup.string().default(""),
});

export type ClienteFormValues = yup.InferType<typeof clienteSchema>;
