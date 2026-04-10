"use client";

import { getAllScalesMini } from "@/app/api/escala_miniatura";
import { getAllLinesMini } from "@/app/api/linha_miniatura";
import { getAllMarksMini } from "@/app/api/marca_miniatura";
import { getAllStatusMini } from "@/app/api/status_miniatura";
import { getAllTypesMini } from "@/app/api/tipo_miniatura";
import { useLoading } from "@/app/hooks/useLoading";
import { GenericGetTypes } from "@/app/types";
import { getErrorMessage } from "@/app/utils";
import { Button, Input, Modal, Popconfirm, Space, Table } from "antd";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ModalAddItensProps } from "./types";

export const ModalAddItens = ({
  title,
  typeAdd,
  loading,
  isVisible,
  handleVisibility,
  onCreate,
  onUpdate,
  onDelete,
  handleForceRefreshLists,
}: ModalAddItensProps) => {
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [listData, setListData] = useState<GenericGetTypes[]>([]);
  const { hideLoading, showLoading } = useLoading();
  const handleSubmit = async () => {
    if (!value.trim()) return;

    try {
      if (editingId) {
        await onUpdate(editingId, value);
        setEditingId(null);
      } else {
        await onCreate(value);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setValue("");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "20%",
    },
    {
      title: "Nome",
      dataIndex: "nome",
      width: "60%", // maior
      key: "nome",
    },
    {
      title: "Excluir",
      key: "actions",
      width: "20%",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => (
        <Space style={{ width: "100%" }} className="ml-3">
          <Popconfirm
            title="Deseja excluir?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger size="small" icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const validateTypeAdd = async () => {
    showLoading();
    const apiMethods = {
      marca: getAllMarksMini,
      tipos: getAllTypesMini,
      linha: getAllLinesMini,
      status: getAllStatusMini,
      escala: getAllScalesMini,
    };
    const fetchMethod = apiMethods[typeAdd];

    if (!fetchMethod) return;
    try {
      const { data } = await fetchMethod();
      setListData(data); // Supondo que seu state se chame setData
    } catch (e) {
      toast.error(getErrorMessage(e));
      handleVisibility();
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (isVisible && typeAdd) {
      validateTypeAdd();
    }
  }, [typeAdd]);

  return (
    <Modal
      title={`Gerenciar ${title}`}
      open={isVisible}
      onCancel={handleVisibility}
      footer={null}
    >
      <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
        <Input
          placeholder={`Adicionar ${title}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Button type="primary" onClick={handleSubmit}>
          {editingId ? "Salvar" : "Adicionar"}
        </Button>
      </Space.Compact>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={listData}
        columns={columns}
        pagination={false}
        scroll={{ y: 300 }} // 👈 altura máxima
      />
    </Modal>
  );
};
