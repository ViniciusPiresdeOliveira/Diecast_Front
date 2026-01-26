import { Miniatura } from "../../types";

export interface CardProps {
  mini: Miniatura;
  handleSelectedImage: (e: string) => void;
}
