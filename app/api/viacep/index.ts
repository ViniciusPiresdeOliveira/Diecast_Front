import { ViaCepResponse } from "./types";

export const fetchAddressByCep = async (
  cep: string,
): Promise<ViaCepResponse | null> => {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    const data: ViaCepResponse = await response.json();

    if (data.erro) return null;

    return data;
  } catch {
    return null;
  }
};
