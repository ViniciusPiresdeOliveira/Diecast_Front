export const defaultValuesForm = {
  clientId: "",
  quantity: 1,
};

export const validateGarageQuantity = ({
  quantity,
  availableQty,
}: {
  quantity: number;
  availableQty: number;
}) => {
  if (quantity > availableQty) {
    return "Quantidade maior que a disponível em estoque";
  }
  return null;
};
