export interface FilterMiniatura {
  nome: string | null;
  marcaId: string[] | null;
  ano: number | null;
  tipoId: string[] | null;
  linhaId: string[] | null;
  status: string[] | null;
  escala: string[] | null;
  precoMin: number | null;
  precoMax: number | null;
  page: number;
  size: number;
}
