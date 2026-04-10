import axios from "axios";

export const prefixExample = "Ex.: ";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Erro na requisição";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado";
};
