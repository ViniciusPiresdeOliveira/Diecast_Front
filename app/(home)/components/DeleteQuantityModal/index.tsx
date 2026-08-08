"use client";
import { QuantitySelector } from "@/app/components/QuantitySelector";
import { Input, Modal } from "antd";
import { useState } from "react";
import { DeleteQuantityModalProps } from "./types";

export const DeleteQuantityModal = ({
  open,
  miniNome,
  quantidadeEstoque,
  quantidadeGaragem,
  quantidadeDisponivel,
  onConfirm,
  onCancel,
}: DeleteQuantityModalProps) => {
  const [quantidadeExcluir, setQuantidadeExcluir] = useState(1);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuantidadeExcluir(1);
    }
  }

  return (
    <Modal
      open={open}
      title={`Excluir unidades da miniatura - ${miniNome}`}
      okText="Excluir"
      cancelText="Cancelar"
      onOk={() => onConfirm(quantidadeExcluir)}
      onCancel={onCancel}
      okButtonProps={{ danger: true, disabled: quantidadeExcluir < 1 }}
    >
      <p className="mb-4">
        Essa miniatura possui mais de 1 unidade, selecione a quantidade a ser
        excluída
      </p>
      {/* <p className="mb-4">
        É possível somente excluir unidades de miniaturas disponíveis, portanto
        quando uma miniatura estiver em uma ou mais garagem é necessário entrar
        na respectiva garagem
      </p> */}

      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Quantidade em estoque
          </label>
          <Input value={quantidadeEstoque} readOnly disabled />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Quantidade na garagem
          </label>
          <Input value={quantidadeGaragem} readOnly disabled />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Quantidade disponível
          </label>
          <Input value={quantidadeDisponivel} readOnly disabled />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Quantidade a excluir
          </label>
          <QuantitySelector
            value={quantidadeExcluir}
            onChange={setQuantidadeExcluir}
            min={1}
            max={quantidadeDisponivel}
          />
        </div>
      </div>
    </Modal>
  );
};
