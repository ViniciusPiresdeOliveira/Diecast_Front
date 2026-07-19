export type TypeAdd = "marca" | "tipos" | "linha" | "condicao" | "escala";
export interface LabelProps {
  text: string;
  className?: string;
  required?: boolean;
  iconAdd?: TypeAdd;
  handleForceRefreshLists?: (type: TypeAdd) => void;
}
