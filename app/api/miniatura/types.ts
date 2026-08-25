export interface FilterMiniatura {
  nome: string | null;
  marcaIds: number[] | null;
  ano: number | null;
  tipoIds: number[] | null;
  linhaIds: number[] | null;
  condicaoIds: number[] | null;
  escalaIds: number[] | null;
  precoMin: number | null;
  precoMax: number | null;
  page: number;
  size: number;
  quantidadeDisponivelMin: number | null;
}
