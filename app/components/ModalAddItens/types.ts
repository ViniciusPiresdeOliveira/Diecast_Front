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
  onCreate: (value: string) => Promise<void> | void;
  onUpdate: (id: ModalAddItens["id"], value: string) => Promise<void> | void;
  onDelete: (id: ModalAddItens["id"]) => Promise<void> | void;
};
