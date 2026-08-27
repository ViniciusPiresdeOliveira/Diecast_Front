import * as yup from "yup";

export const garagemSchema = yup.object({
  clientId: yup.string().required("Selecione um cliente"),
  quantity: yup
    .number()
    .required("Informe a quantidade")
    .min(1, "A quantidade deve ser maior que zero"),
});

export type GaragemFormValues = yup.InferType<typeof garagemSchema>;
