import { Miniatura } from "../../types";

export interface ModalFormMiniProps {
  visible: boolean;
  mini: Miniatura | null;
  title: string;
  handleVisibleFormMini: () => void;
}
