export interface Miniatura {
  id: number;
  name: string;
  ano: number;
  preco: number;
  marca: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
}
