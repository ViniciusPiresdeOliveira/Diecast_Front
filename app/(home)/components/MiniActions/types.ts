import { Miniatura } from "../../types";
import { TypeOfModalAction } from "../ModalFormMini/types";

export type MiniActionsProps = {
  mini: Miniatura;
  refreshList?: () => void;
  handleSelectedMini: (mini: Miniatura | null) => void;
  handleVisibleFormMini: (type: TypeOfModalAction) => void;
  handleDeleteMiniById: (
    mini: Miniatura,
    quantidade?: number,
  ) => Promise<boolean>;
  variant?: "card" | "table";
  isMobile?: boolean;
};
