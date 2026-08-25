import { Cliente } from "@/app/api/cliente/types";

export interface ModalFormClienteProps {
  visible: boolean;
  cliente: Cliente | null;
  handleVisibleFormCliente: (type: "add" | "edit") => void;
  type: "add" | "edit";
  refreshClienteList: () => void;
}
