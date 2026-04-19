import { Miniatura } from "../../types";

export type TypeOfModalAction = "add" | "edit";
export interface ModalFormMiniProps {
  visible: boolean;
  mini: Miniatura | null;
  handleVisibleFormMini: (type: TypeOfModalAction) => void;
  type: TypeOfModalAction;
  refreshMiniList: () => void;
  refreshMarksList: () => Promise<void>;
  refreshTypesList: () => Promise<void>;
  refreshLinesList: () => Promise<void>;
  refreshStatusList: () => Promise<void>;
  refreshScalesList: () => Promise<void>;
}
