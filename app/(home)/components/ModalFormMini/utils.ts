import { UploadFile } from "antd";

export const defaultValuesForm = {
  name: "",
  brand: "",
  year: undefined,
  types: [],
  line: "",
  price: undefined,
  stock: undefined,
  scale: "",
  status: "",
  image: [] as UploadFile[],
};
