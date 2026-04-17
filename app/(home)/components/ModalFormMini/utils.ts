import { MiniFormValues } from "./validation";

export const defaultValuesForm = {
  id: 0,
  nome: "",
  marca: undefined,
  tipos: undefined,
  status: undefined,
  imagem: "", // byte[] → array de números
  ano: 0,
  escala: undefined,
  linha: undefined,
  valor: 0, // BigDecimal → number
};

export const mapMiniaturaPayload = (mini: MiniFormValues) => {
  return {
    nome: mini.name,
    marcaId: Number(mini.brand),
    tiposIds: mini.types?.map((id) => Number(id)) || [],
    statusId: Number(mini.status),
    ano: mini.year,
    escalaId: mini.scale,
    linhaId: Number(mini.line),
    valor: mini.price / 100,
  };
};
