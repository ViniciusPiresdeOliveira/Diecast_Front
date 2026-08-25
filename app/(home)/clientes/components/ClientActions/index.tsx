"use client";

import { DeleteButton } from "@/app/components/Buttons/Delete";
import { EditButton } from "@/app/components/Buttons/Edit";
import { GarageButton } from "@/app/components/Buttons/Garage";
import { DeleteConfirmModal } from "@/app/components/Modal/Delete";
import { useState } from "react";
import { ClientActionsProps } from "./types";

export const ClientActions = ({
  cliente,
  handleSelectedClient,
  handleVisibleFormClient,
  handleDeleteClientById,
  handleOpenGaragem,
  isMobile = false,
}: ClientActionsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    handleSelectedClient(cliente);
    handleVisibleFormClient("edit");
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const success = await handleDeleteClientById(cliente);
    setIsDeleting(false);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  const handleGaragem = () => {
    handleSelectedClient(cliente);
    handleOpenGaragem(cliente);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <EditButton onClick={handleEdit} variant="table" isMobile={isMobile} />

      {/* <button
        onClick={() => handleWhatsApp(cliente.telefone)}
        className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="WhatsApp"
      >
        <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
      </button> */}
      <GarageButton onClick={handleGaragem} variant="table" />

      <DeleteButton
        onClick={() => setIsDeleteModalOpen(true)}
        variant="table"
        isMobile={isMobile}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        title="Excluir cliente"
        confirmText="Excluir"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        message="Tem certeza que deseja excluir "
        nameSpecific={cliente.nome}
      />
    </div>
  );
};
