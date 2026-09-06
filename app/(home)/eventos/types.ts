interface EventoImage {
  id: number;
  imagem: string;
  dataCadastro: string;
}

export interface Evento {
  id: number;
  titulo: string;
  dataEvento: string;
  dataAtualizacao: string;
  dataCadastro: string;
  descricao: string;
  imagens: EventoImage[];
}
