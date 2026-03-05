"use client";

import { Button, Input, Modal, Popconfirm, Space, Table } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ModalAddItensProps } from "./types";

export const ModalAddItens = ({
  title,
  data,
  loading,
  isVisible,
  handleVisibility,
  onCreate,
  onUpdate,
  onDelete,
}: ModalAddItensProps) => {
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);

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
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ações",
      key: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<Pencil size={14} />}
            onClick={() => {
              setEditingId(record.id);
              setValue(record.name);
            }}
          />

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
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </Modal>
  );
};
