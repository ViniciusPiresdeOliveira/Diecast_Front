import { ClienteFormValues } from "./validation";

export const defaultValuesForm = {
  nome: "",
  telefone: "",
  cep: "",
  numeroResidencia: "",
} satisfies ClienteFormValues;

// Formata enquanto o usuário digita (mantém cursor razoável)
export const maskTelefone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

export const maskCep = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
};
