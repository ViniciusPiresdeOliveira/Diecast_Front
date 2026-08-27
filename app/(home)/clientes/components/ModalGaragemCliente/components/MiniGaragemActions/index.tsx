"use client";

import {
  deleteMiniInGarageAndReturnToSystem,
  deleteMiniInGarageAndSystem,
} from "@/app/api/garagem";
import { DeleteConfirmModal } from "@/app/components/Modal/Delete";
import { useLoading } from "@/app/hooks/useLoading";
import { getErrorMessage } from "@/app/utils";
import { Trash2, Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { MiniGaragemActionsProps } from "./types";

export const MiniGaragemActions = ({
  id,
  onRemove,
}: MiniGaragemActionsProps) => {
  const { showLoading, hideLoading } = useLoading();

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleReturn = async () => {
    showLoading();

    try {
      await deleteMiniInGarageAndReturnToSystem(id);
      onRemove(id);
      toast.success("Miniatura retornada ao sistema!");
      setIsReturnModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const handleDelete = async () => {
    showLoading();

    try {
      await deleteMiniInGarageAndSystem(id);
      onRemove(id);
      toast.success("Miniatura marcada como entregue!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setIsReturnModalOpen(true)}
          title="Retornar ao sistema"
          className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <Undo2 size={20} color="#1f3565" />
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          title="Marcar como entregue"
          className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <Trash2 size={20} color="#dc2626" />
        </button>
      </div>

      <DeleteConfirmModal
        open={isReturnModalOpen}
        title="Retornar miniatura"
        confirmText="Retornar"
        onConfirm={handleReturn}
        onCancel={() => setIsReturnModalOpen(false)}
        message="Tem certeza que deseja retornar esta miniatura ao sistema? Ela ficará disponível novamente para outros clientes."
        nameSpecific=""
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        title="Marcar como entregue"
        confirmText="Confirmar"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        message="Tem certeza que deseja marcar esta miniatura como entregue? Essa ação irá remover a unidade da garagem do cliente e reduzir a quantidade disponível em estoque."
        nameSpecific=""
      />
    </>
  );
};
