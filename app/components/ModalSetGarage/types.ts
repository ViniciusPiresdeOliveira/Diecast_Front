import { Miniatura } from "@/app/(home)/types";

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
}

export interface ModalAddGaragemProps {
  visible: boolean;
  mini: Miniatura | null;
  handleVisibleModal: () => void;
  refreshList?: () => void;
}
