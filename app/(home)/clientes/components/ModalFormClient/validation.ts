import * as yup from "yup";

export const clienteSchema = yup.object({
  nome: yup.string().required("Nome é obrigatório"),
  telefone: yup
    .string()
    .required("Telefone é obrigatório")
    .test("telefone-valido", "Telefone inválido", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 10 || digits.length === 11;
    }),
  cep: yup
    .string()
    .nullable()
    .notRequired()
    .test("cep-valido", "Cep inválido", (value) => {
      if (!value) return true; // opcional
      const digits = value.replace(/\D/g, "");
      return digits.length === 8;
    }),
  numeroResidencia: yup.string().nullable().notRequired(),
});

export type ClienteFormValues = yup.InferType<typeof clienteSchema>;
