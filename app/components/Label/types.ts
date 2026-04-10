export type TypeAdd = "marca" | "tipos" | "linha" | "status" | "escala";
export interface LabelProps {
  text: string;
  className?: string;
  required?: boolean;
  iconAdd?: TypeAdd;
  handleForceRefreshLists?: (type: TypeAdd) => void;
}
