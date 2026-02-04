import { Miniatura } from "../../types";

export interface ModalFormMiniProps {
  visible: boolean;
  mini: Miniatura;
  title: string;
  handleVisibleFormMini: () => void;
}
