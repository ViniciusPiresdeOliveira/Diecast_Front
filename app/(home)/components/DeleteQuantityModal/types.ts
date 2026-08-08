export type DeleteQuantityModalProps = {
  open: boolean;
  miniNome: string;
  quantidadeEstoque: number;
  quantidadeGaragem: number;
  quantidadeDisponivel: number;
  onConfirm: (quantidade: number) => void;
  onCancel: () => void;
};
