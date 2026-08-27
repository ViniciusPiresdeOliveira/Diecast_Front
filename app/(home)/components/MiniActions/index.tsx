"use client";

import { DeleteButton } from "@/app/components/Buttons/Delete";
import { EditButton } from "@/app/components/Buttons/Edit";
import { GarageButton } from "@/app/components/Buttons/Garage";
import { DeleteConfirmModal } from "@/app/components/Modal/Delete";
import { Image, Tooltip } from "antd";
import { Eye } from "lucide-react";
import { useState } from "react";
import { formatImage } from "../../utils";
import { DeleteQuantityModal } from "../DeleteQuantityModal";
import { MiniActionsProps } from "./types";
import { ModalSetGarage } from "@/app/components/ModalSetGarage";

export const MiniActions = ({
  mini,
  handleSelectedMini,
  handleVisibleFormMini,
  handleDeleteMiniById,
  variant = "card",
  isMobile = false,
}: MiniActionsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isDeleteQuantityModalOpen, setIsDeleteQuantityModalOpen] =
    useState(false);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);

  const quantidadeEstoque = mini.quantidadeEstoque ?? 0;
  const quantidadeGaragem = mini.quantidadeEmGaragem ?? 0;
  const quantidadeDisponivel = mini.quantidadeDisponivel ?? 0;

  const temMaisDeUmaUnidade = quantidadeEstoque > 1;
  const semUnidadeDisponivel = quantidadeDisponivel === 0;

  const handleOpenDelete = () => {
    if (temMaisDeUmaUnidade) {
      setIsDeleteQuantityModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleEdit = () => {
    handleSelectedMini(mini);
    handleVisibleFormMini("edit");
  };

  const handleConfirmDelete = async (qtd?: number) => {
    const success = await handleDeleteMiniById(mini, qtd);
    if (success) {
      setIsDeleteModalOpen(false);
      setIsDeleteQuantityModalOpen(false);
    }
  };

  const handleGetMiniImageById = async () => {
    setIsImagePreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const handleOpenGarageModal = () => {
    setIsGarageModalOpen(true);
  };

  const handleCloseGarageModal = () => {
    setIsGarageModalOpen(false);
  };

  const deleteModal = (
    <DeleteConfirmModal
      open={isDeleteModalOpen}
      title="Excluir miniatura"
      confirmText="Excluir"
      onConfirm={handleConfirmDelete}
      onCancel={() => setIsDeleteModalOpen(false)}
      message="Tem certeza que deseja excluir "
      nameSpecific={mini.nome}
    />
  );

  const deleteQuantityModal = (
    <DeleteQuantityModal
      open={isDeleteQuantityModalOpen}
      miniNome={mini.nome}
      quantidadeEstoque={quantidadeEstoque}
      quantidadeGaragem={quantidadeGaragem}
      quantidadeDisponivel={quantidadeDisponivel}
      onConfirm={handleConfirmDelete}
      onCancel={() => setIsDeleteQuantityModalOpen(false)}
    />
  );

  const garageModal = (
    <ModalSetGarage
      visible={isGarageModalOpen}
      mini={mini}
      handleVisibleModal={handleCloseGarageModal}
    />
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
        <Tooltip
          title={
            semUnidadeDisponivel
              ? "Esta miniatura não possui nenhuma unidade disponível"
              : undefined
          }
        >
          <span
            className={
              semUnidadeDisponivel ? "opacity-50 cursor-not-allowed" : ""
            }
          >
            <GarageButton
              onClick={handleOpenGarageModal}
              variant="table"
              disabled={semUnidadeDisponivel}
            />
          </span>
        </Tooltip>

        <button
          onClick={handleGetMiniImageById}
          className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <Eye size={22} color="#1f3565" />
        </button>

        <DeleteButton onClick={handleOpenDelete} variant="table" />

        {deleteModal}
        {deleteQuantityModal}
        {garageModal}
        {imagePreview}
      </div>
    );
  }

  return (
    <>
      <EditButton onClick={handleEdit} variant="card" isMobile={isMobile} />
      <Tooltip
        title={
          semUnidadeDisponivel
            ? "Esta miniatura não possui nenhuma unidade disponível"
            : undefined
        }
      >
        <span
          className={
            semUnidadeDisponivel ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          <GarageButton
            onClick={handleOpenGarageModal}
            variant="card"
            isMobile={isMobile}
            disabled={semUnidadeDisponivel}
          />
        </span>
      </Tooltip>

      <DeleteButton
        onClick={handleOpenDelete}
        variant="card"
        isMobile={isMobile}
      />

      {deleteModal}
      {deleteQuantityModal}
    </>
  );
};
