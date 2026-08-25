import { toast } from "react-toastify";
import { ViaCepResponse } from "./types";

export const fetchAddressByCep = async (
  cep: string,
): Promise<ViaCepResponse | null> => {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      toast.error("CEP não encontrado!");

      const error = new Error("CEP não encontrado!");
      (error as Error & { status: number }).status = 404;

      throw error;
    }

    return data;
  } catch {
    return null;
  }
};
