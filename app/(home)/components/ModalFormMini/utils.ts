import { MiniFormValues } from "./validation";

export const defaultValuesForm = {
  id: 0,
  name: "",
  brand: undefined,
  types: undefined,
  condition: undefined,
  image: [],
  year: undefined,
  scale: undefined,
  line: undefined,
  price: 0,
  stockQty: 1,
  availableQty: 1,
  garageQty: 0,
};

export const mapMiniaturaPayload = (mini: MiniFormValues) => {
  return {
    nome: mini.name,
    marcaId: Number(mini.brand),
    tiposIds: mini.types?.map((id) => Number(id)) || [],
    condicaoId: Number(mini.condition),
    ano: mini.year,
    escalaId: mini.scale,
    linhaId: Number(mini.line),
    valor: mini.price / 100,
    quantidadeEstoque: Number(mini.stockQty),
    quantidadeDisponivel: Number(mini.availableQty),
    quantidadeEmGaragem: Number(mini.garageQty),
  };
};

export const validateQuantities = ({
  stockQty,
  availableQty,
  garageQty,
}: {
  stockQty?: number;
  availableQty?: number;
  garageQty?: number;
}) => {
  if (
    stockQty === undefined ||
    availableQty === undefined ||
    garageQty === undefined
  ) {
    return null;
  }

  if (availableQty + garageQty > stockQty) {
    return "A soma de Qtd. Disponível + Qtd. Garagem não pode ser maior que o Qtd. Estoque";
  } else if (stockQty !== garageQty + availableQty) {
    return "Qtd. Estoque tem quer igual à soma de Qtd. Disponível + Qtd. Garagem";
  }

  return null;
};
