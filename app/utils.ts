import axios from "axios";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const prefixExample = "Ex.: ";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      return "Sessão expirada. Faça login novamente.";
    }

    return error.response?.data?.message || "Erro na requisição";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado";
};

export const getCodError = (error: unknown): string | number | undefined => {
  if (axios.isAxiosError(error)) {
    return error ? error.response?.status : "Erro inesperado";
  }
};

export const formatCurrencyBRL = (value?: number | string) => {
  if (value === null || value === undefined) return "";

  const number = typeof value === "string" ? Number(value) : value;

  if (isNaN(number)) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
};

export const toNumberArray = (arr?: string[] | null) => {
  const result = arr?.map(Number).filter((n) => !isNaN(n));
  return result && result.length > 0 ? result : null;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCep = (cep?: string | null): string => {
  if (!cep) return "";

  const digits = cep.replace(/\D/g, "");

  if (digits.length !== 8) return cep;

  return digits.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};

export const formatTelefone = (telefone?: string | null): string => {
  if (!telefone) return "";

  const digits = telefone.replace(/\D/g, "");

  if (digits.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  if (digits.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return telefone;
};

export const formatDateTimeToPtBR = (data: string): string => {
  const normalized = data.replace(/(\.\d{3})\d*Z$/, "$1Z");
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR");
};

export const formatSimpleDate = (date: string): string => {
  const [ano, mes, dia] = date.split("-");
  return `${dia}/${mes}/${ano}`;
};

export const handleWhatsApp = (tel: string) => {
  if (!tel) return;

  const telefone = tel.replace(/\D/g, "");

  // Adiciona o código do Brasil caso o telefone não tenha
  const telefoneWhatsApp = telefone.startsWith("55")
    ? telefone
    : `55${telefone}`;

  window.open(`https://wa.me/${telefoneWhatsApp}`, "_blank");
};
