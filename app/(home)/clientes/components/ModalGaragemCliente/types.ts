import { Cliente } from "@/app/api/cliente/types";
import { GenericGetTypes } from "@/app/types";

export interface MiniGaragemCliente {
  idMiniatura: number;
  idGaragem: number;
  nome: string;
  marca: GenericGetTypes;
  tipos: GenericGetTypes[];
  condicao: GenericGetTypes;
  ano: number;
  escala: GenericGetTypes;
  linha: GenericGetTypes;
  valor: number;
  quantidadeEmGaragem: number;
}

export interface ModalGaragemClienteProps {
  visible: boolean;
  cliente: Cliente | null;
  onClose: () => void;
}

export interface GaragemClienteResponse {
  id: number;
  nome: string;
  miniaturas: MiniGaragemCliente[];
}

export interface ModalGaragemClienteProps {
  visible: boolean;
  cliente: Cliente | null;
  onClose: () => void;
}

export interface BuildMessageParams {
  nome: string;
  minis: MiniGaragemCliente[];
  cep?: string;
  numero?: string;
}

export interface BuildEnderecoParams {
  cep?: string;
  numero?: string;
}
