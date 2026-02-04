import { Modal } from "antd";
import { useEffect, useState } from "react";
import { ModalFormMiniProps } from "./types";

export const ModalFormMini = ({
  visible,
  mini,
  handleVisibleFormMini,
  title,
}: ModalFormMiniProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    handleVisibleFormMini();
  };

  const handleCancel = () => {
    handleVisibleFormMini();
  };

  useEffect(() => {
    setIsModalOpen(visible);
  }, [visible]);

  return (
    <Modal
      title={title}
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>{mini.name}</p>
      <p>{mini.ano}</p>
      <p>{mini.preco}</p>
      <p>{mini.marca}</p>
    </Modal>
  );
};
