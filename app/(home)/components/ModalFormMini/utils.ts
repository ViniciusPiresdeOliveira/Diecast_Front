import { MiniFormValues } from "./validation";

export const defaultValuesForm = {
  id: 0,
  nome: "",
  marca: undefined,
  tipos: undefined,
  condicao: undefined,
  imagem: "",
  ano: 0,
  escala: undefined,
  linha: undefined,
  valor: 0,
  stock: 1,
};

export const mapMiniaturaPayload = (mini: MiniFormValues, isPost: boolean) => {
  return {
    nome: mini.name,
    marcaId: Number(mini.brand),
    tiposIds: mini.types?.map((id) => Number(id)) || [],
    condicaoId: Number(mini.condition),
    ano: mini.year,
    escalaId: mini.scale,
    linhaId: Number(mini.line),
    valor: mini.price / 100,
    ...(isPost && { quantidadeEstoque: mini.stock }),
  };
};
