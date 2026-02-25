import { Miniatura } from "../../types";

export interface ModalFormMiniProps {
  visible: boolean;
  mini: Miniatura | null;
  handleVisibleFormMini: () => void;
  type: "add" | "edit";
}
