import { Miniatura } from "../../types";
import { TypeOfModalAction } from "../ModalFormMini/types";

export interface CardProps {
  mini: Miniatura;
  handleSelectedMini: (e: Miniatura | null) => void;
  handleVisibleFormMini: (type: TypeOfModalAction) => void;
  refreshMiniList: () => void;
  handleDeleteMiniById: (mini: Miniatura) => Promise<boolean>;
}
