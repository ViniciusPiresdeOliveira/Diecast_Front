import { Cliente } from "@/app/api/cliente/types";

export interface ClientActionsProps {
  cliente: Cliente;
  handleSelectedClient: (cliente: Cliente) => void;
  handleVisibleFormClient: (mode: "create" | "edit") => void;
  handleDeleteClientById: (cliente: Cliente) => Promise<boolean>;
  handleOpenGaragem: (cliente: Cliente) => void;
  isMobile?: boolean;
}
