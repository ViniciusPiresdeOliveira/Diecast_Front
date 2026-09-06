import { Evento } from "../../types";

export type TypeOfModalAction = "add" | "edit";

export interface ModalFormEventoProps {
  type: TypeOfModalAction;
  evento: Evento | null;
  visible: boolean;
  handleVisibleFormEvento: (type: TypeOfModalAction) => void;
  refreshEventoList: () => void;
}
