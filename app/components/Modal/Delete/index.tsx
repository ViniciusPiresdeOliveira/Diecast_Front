"use client";

import { Modal as AntModal } from "antd";
import { DeleteConfirmModalProps } from "./types";

export const DeleteConfirmModal = ({
  open,
  title,
  message,
  nameSpecific,
  children,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  danger = true,
  centered = true,
}: DeleteConfirmModalProps) => {
  return (
    <AntModal
      title={
        typeof title === "string" ? (
          <span className="text-xl font-bold">{title}</span>
        ) : (
          title
        )
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{
        danger,
        loading: isLoading,
        className: "!text-base !h-10 !px-5",
      }}
      cancelButtonProps={{
        disabled: isLoading,
        className: "!text-base !h-10 !px-5",
      }}
      centered={centered}
    >
      {children ??
        ((message || nameSpecific) && (
          <p className="text-lg text-zinc-700 mt-2">
            {message}
            {nameSpecific && (
              <>
                <span className="font-bold text-zinc-900">{nameSpecific}</span>{" "}
                ?
              </>
            )}
          </p>
        ))}
    </AntModal>
  );
};
