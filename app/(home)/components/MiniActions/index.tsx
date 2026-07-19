"use client";

import { DeleteButton } from "@/app/components/Buttons/Delete";
import { EditButton } from "@/app/components/Buttons/Edit";
import { DeleteConfirmModal } from "@/app/components/Modal/Delete";
import { Image } from "antd";
import { Eye } from "lucide-react";
import { useState } from "react";
import { formatImage } from "../../utils";
import { MiniActionsProps } from "./types";

export const MiniActions = ({
  mini,
  handleSelectedMini,
  handleVisibleFormMini,
  handleDeleteMiniById,
  variant = "card",
  isMobile = false,
}: MiniActionsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const handleEdit = () => {
    handleSelectedMini(mini);
    handleVisibleFormMini("edit");
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const success = await handleDeleteMiniById(mini);
    setIsDeleting(false);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  const handleGetMiniImageById = async () => {
    setIsImagePreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const deleteModal = (
    <DeleteConfirmModal
      open={isDeleteModalOpen}
      title="Excluir miniatura"
      confirmText="Excluir"
      isLoading={isDeleting}
      onConfirm={handleConfirmDelete}
      onCancel={() => setIsDeleteModalOpen(false)}
      message="Tem certeza que deseja excluir "
      nameSpecific={mini.nome}
    >
      {/* <p className="text-lg text-zinc-700 mt-2">
        Tem certeza que deseja excluir{" "}
        <span className="font-bold text-zinc-900">{mini.nome}</span>?
      </p> */}
    </DeleteConfirmModal>
  );

  const imagePreview = mini.imagem && (
    <Image
      style={{ display: "none" }}
      src={formatImage(mini.imagem)}
      preview={{
        visible: isImagePreviewOpen,
        onVisibleChange: (visible) => {
          if (!visible) handleClosePreview();
        },
      }}
    />
  );

  if (variant === "table") {
    return (
      <div className="flex items-center justify-center gap-3">
        <EditButton onClick={handleEdit} variant="table" />

        <button
          onClick={handleGetMiniImageById}
          className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <Eye size={22} color="#1f3565" />
        </button>

        <DeleteButton
          onClick={() => setIsDeleteModalOpen(true)}
          variant="table"
        />

        {deleteModal}
        {imagePreview}
      </div>
    );
  }

  return (
    <>
      <EditButton onClick={handleEdit} variant="card" isMobile={isMobile} />
      <DeleteButton
        onClick={() => setIsDeleteModalOpen(true)}
        variant="card"
        isMobile={isMobile}
      />

      {deleteModal}
    </>
  );
};
