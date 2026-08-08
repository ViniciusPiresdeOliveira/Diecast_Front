"use client";

import { getAllMinisByClient } from "@/app/api/garagem";
import { useLoading } from "@/app/hooks/useLoading";
import {
  formatCurrencyBRL,
  formatDate,
  formatTelefone,
  getErrorMessage,
  handleWhatsApp,
} from "@/app/utils";
import type { TableColumnsType } from "antd";
import { Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MiniGaragemActions } from "./components/MiniGaragemActions";
import { MiniGaragemCliente, ModalGaragemClienteProps } from "./types";
import { calculateDaysInGarage } from "./utils";

export const ModalGaragemCliente = ({
  visible,
  cliente,
  onClose,
}: ModalGaragemClienteProps) => {
  const { showLoading, hideLoading } = useLoading();
  const [listMinis, setListMinis] = useState<MiniGaragemCliente[]>([]);

  const boldTitle = (text: string) => (
    <span className="font-bold text-lg">{text}</span>
  );

  const columns: TableColumnsType<MiniGaragemCliente> = [
    {
      title: boldTitle("Nome"),
      dataIndex: "nome",
      key: "nome",
      align: "center",
    },
    {
      title: boldTitle("Qtd na Garagem"),
      dataIndex: "quantidadeEmGaragem",
      key: "quantidadeEmGaragem",
      align: "center",
    },
    {
      title: boldTitle("Valor"),
      dataIndex: "valor",
      key: "valor",
      align: "center",
      render: (valor: number) => formatCurrencyBRL(valor),
    },
    {
      title: boldTitle("Entrada na Garagem"),
      dataIndex: "dataCadastro",
      key: "dataCadastro",
      align: "center",
      render: (data: string) => formatDate(data),
    },
    {
      title: boldTitle("Dias na Garagem"),
      dataIndex: "dataCadastro",
      key: "diasNaGaragem",
      align: "center",
      render: (data: string) => {
        const dias = calculateDaysInGarage(data);
        return `${dias} ${dias === 1 ? "dia" : "dias"}`;
      },
    },
    {
      title: boldTitle("Ações"),
      key: "acoes",
      align: "center",
      width: "12%",
      render: (_, record) => (
        <MiniGaragemActions
          id={record.idGaragem}
          refreshList={fetchMinisByCliente}
        />
      ),
    },
  ];

  const fetchMinisByCliente = async () => {
    if (!cliente) return;

    showLoading();
    try {
      const { data } = await getAllMinisByClient(cliente.id);
      setListMinis(data.miniaturas);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  // Busca inicial ao abrir o modal / trocar cliente
  useEffect(() => {
    if (visible && cliente) {
      fetchMinisByCliente();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, cliente]);

  const handleClose = () => {
    setListMinis([]);
    onClose();
    hideLoading();
  };

  return (
    <Modal
      title={
        cliente ? (
          <span
            onClick={() => handleWhatsApp(cliente.telefone)}
            className="cursor-pointer hover:underline"
          >
            {cliente.nome} - {formatTelefone(cliente.telefone)}
          </span>
        ) : (
          "Miniaturas do Cliente"
        )
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={"70%"}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={listMinis}
        pagination={false}
        scroll={{ x: true }}
      />
    </Modal>
  );
};
