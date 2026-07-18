import { Miniatura } from "../../types";
import { TypeOfModalAction } from "../ModalFormMini/types";

export type MiniActionsProps = {
  mini: Miniatura;
  handleSelectedMini: (mini: Miniatura | null) => void;
  handleVisibleFormMini: (type: TypeOfModalAction) => void;
  handleDeleteMiniById: (mini: Miniatura) => Promise<boolean>;
  variant?: "card" | "table";
  isMobile?: boolean;
};
