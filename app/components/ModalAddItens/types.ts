import { TypeAdd } from "../Label/types";

export type ModalAddItens = {
  id: number | string;
  name: string;
};

export type ModalAddItensProps = {
  title: string;
  typeAdd: TypeAdd;
  loading?: boolean;
  isVisible: boolean;

  handleForceRefreshLists?: (type: TypeAdd) => void;
  handleVisibility: () => void;
};
