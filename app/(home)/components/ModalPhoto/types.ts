import { Miniatura } from "../../types";

export interface ModalPhotoProps {
  selectedMini: Miniatura | null;
  handleSelectedMini: (mini: Miniatura | null) => void;
}
