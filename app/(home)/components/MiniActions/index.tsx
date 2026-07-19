"use client";

import { getMiniImageById } from "@/app/api/miniatura";
import { useLoading } from "@/app/hooks/useLoading";
import { getErrorMessage } from "@/app/utils";
import { Image, Modal } from "antd";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const { showLoading, hideLoading } = useLoading();

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
    showLoading();
    try {
      const { data } = await getMiniImageById(mini.id);
      const url = URL.createObjectURL(data);
      setImageUrl(url);
      setIsImagePreviewOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const handleClosePreview = () => {
    setIsImagePreviewOpen(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  };

  const deleteModal = (
    <Modal
      title={<span className="text-xl font-bold">Excluir miniatura</span>}
      open={isDeleteModalOpen}
      onOk={handleConfirmDelete}
      onCancel={() => setIsDeleteModalOpen(false)}
      okText="Excluir"
      cancelText="Cancelar"
      okButtonProps={{
        danger: true,
        loading: isDeleting,
        className: "!text-base !h-10 !px-5",
      }}
      cancelButtonProps={{
        disabled: isDeleting,
        className: "!text-base !h-10 !px-5",
      }}
      centered
    >
      <p className="text-lg text-zinc-700 mt-2">
        Tem certeza que deseja excluir{" "}
        <span className="font-bold text-zinc-900">{mini.nome}</span>?
      </p>
    </Modal>
  );

  const imagePreview = imageUrl && (
    <Image
      style={{ display: "none" }}
      src={imageUrl}
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
        <button
          type="button"
          onClick={handleEdit}
          className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <Pencil size={20} color="#07ac5a" />
        </button>

        <button
          onClick={handleGetMiniImageById}
          className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <Eye size={24} color="#1f3565" />
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <Trash2 size={20} color="#f31a13" />
        </button>

        {deleteModal}
        {imagePreview}
      </div>
    );
  }

  const visibilityClasses = isMobile
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0";

  return (
    <>
      {/* EDITAR */}
      <button
        onClick={handleEdit}
        className={
          "z-10 cursor-pointer w-8 h-8 absolute right-2 bottom-24 " +
          "flex items-center justify-center " +
          "transition-all duration-300 hover:scale-110 " +
          visibilityClasses
        }
      >
        <Pencil size={24} color="#07ac5a" />
      </button>

      {/* EXCLUIR */}
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className={
          "z-10 cursor-pointer w-8 h-8 absolute right-2 bottom-15 " +
          "flex items-center justify-center rounded-full " +
          "transition-all duration-300 hover:scale-110 " +
          visibilityClasses
        }
      >
        <Trash2 size={24} color="#f31a13" />
      </button>

      {deleteModal}
    </>
  );
};
