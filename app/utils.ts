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

export const formatCurrencyBRL = (value?: number | string) => {
  if (value === null || value === undefined) return "";

  const number = typeof value === "string" ? Number(value) : value;

  if (isNaN(number)) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
};

export const toNumberArray = (arr?: string[] | null) =>
  arr?.map(Number).filter((n) => !isNaN(n)) || null;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
