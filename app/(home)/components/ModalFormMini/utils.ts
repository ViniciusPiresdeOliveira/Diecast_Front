import { UploadFile } from "antd";
import { MiniFormValues } from "./validation";

export const defaultValuesForm = {
  name: "",
  brand: "",
  year: undefined,
  types: [],
  line: "",
  price: undefined,
  stock: 1,
  scale: "",
  status: "",
  image: [] as UploadFile[],
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
