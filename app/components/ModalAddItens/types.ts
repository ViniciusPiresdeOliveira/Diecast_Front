export type ModalAddItens = {
  id: number | string;
  name: string;
};

export type ModalAddItensProps = {
  title: string;
  data: ModalAddItens[];
  loading?: boolean;
  isVisible: boolean;

  handleVisibility: () => void;
  onCreate: (value: string) => Promise<void> | void;
  onUpdate: (id: ModalAddItens["id"], value: string) => Promise<void> | void;
  onDelete: (id: ModalAddItens["id"]) => Promise<void> | void;
};
