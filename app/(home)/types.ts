export interface MarcaMiniatura {
  id: number;
  nome: string;
}

export interface TipoMiniatura {
  id: number;
  nome: string;
}

export interface StatusMiniatura {
  id: number;
  nome: string;
}

export interface EscalaMiniatura {
  id: number;
  nome: string;
}

export interface LinhaMiniatura {
  id: number;
  nome: string;
}
export interface Miniatura {
  id: number;
  nome: string;
  marca: MarcaMiniatura;
  tipos: TipoMiniatura[];
  status: StatusMiniatura;
  imagem?: string; // byte[] → array de números
  ano: number;
  escala: EscalaMiniatura;
  linha: LinhaMiniatura;
  valor: number; // BigDecimal → number
}

export interface PaginationInfo {
  totalPages: number;
  totalElements: number;
  elementsPerPage: number;
  pageSize: number;
}
