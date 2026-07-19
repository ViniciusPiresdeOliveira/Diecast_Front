import { ReactNode } from "react";

export interface DeleteConfirmModalProps {
  open: boolean;
  title: ReactNode;
  message?: string;
  nameSpecific?: string;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  danger?: boolean;
  centered?: boolean;
}
