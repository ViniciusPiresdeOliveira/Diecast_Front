import { Miniatura } from "../../types";

export interface CardProps {
  mini: Miniatura;
  handleSelectedMini: (e: Miniatura | null) => void;
}
