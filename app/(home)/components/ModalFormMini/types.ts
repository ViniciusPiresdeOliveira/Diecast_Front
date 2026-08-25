import { Miniatura } from "../../types";

export type TypeOfModalAction = "add" | "edit";
export interface ModalFormMiniProps {
  visible: boolean;
  mini: Miniatura | null;
  handleVisibleFormMini: (type: TypeOfModalAction) => void;
  type: TypeOfModalAction;
  refreshMiniList: () => void;
}
