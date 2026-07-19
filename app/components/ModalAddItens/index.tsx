"use client";

import {
  deleteConditionMiniById,
  getAllConditionMini,
  postConditionMini,
} from "@/app/api/condicao_miniatura";
import {
  deleteScaleMiniById,
  getAllScalesMini,
  postScaleMini,
} from "@/app/api/escala_miniatura";
import {
  deleteLineMiniById,
  getAllLinesMini,
  postLineMini,
} from "@/app/api/linha_miniatura";
import {
  deleteMarkMiniById,
  getAllMarksMini,
  postMarkMini,
} from "@/app/api/marca_miniatura";
import {
  deleteTypesMiniById,
  getAllTypesMini,
  postTypesMini,
} from "@/app/api/tipo_miniatura";
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
  handleForceRefreshLists,
}: ModalAddItensProps) => {
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [listData, setListData] = useState<GenericGetTypes[]>([]);
  const { hideLoading, showLoading } = useLoading();

  const handleSubmit = async () => {
    if (!value.trim()) return;

    showLoading();

    const createMethods = {
      marca: postMarkMini,
      tipos: postTypesMini,
      linha: postLineMini,
      condicao: postConditionMini,
      escala: postScaleMini,
    };

    const createMethod = createMethods[typeAdd];

    if (!createMethod) return;

    try {
      await createMethod({ nome: value });

      toast.success(`${value} criado com sucesso`);

      await fetchGetAllTypeAdd();
      handleForceRefreshLists?.(typeAdd);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setValue("");
      hideLoading();
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
            onConfirm={() => handleDeleteByType(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              danger
              className="transition-all duration-300 ease-out
      hover:scale-110"
              size="small"
              icon={<Trash2 size={14} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchGetAllTypeAdd = async () => {
    showLoading();
    const apiMethods = {
      marca: getAllMarksMini,
      tipos: getAllTypesMini,
      linha: getAllLinesMini,
      condicao: getAllConditionMini,
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

  const handleDeleteByType = async (id: number) => {
    showLoading();

    const deleteMethods = {
      marca: deleteMarkMiniById,
      tipos: deleteTypesMiniById,
      linha: deleteLineMiniById,
      condicao: deleteConditionMiniById,
      escala: deleteScaleMiniById,
    };

    const deleteMethod = deleteMethods[typeAdd];

    if (!deleteMethod) return;

    try {
      await deleteMethod(id);
      const nameDeleted = listData?.filter((e) => e.id === id)[0].nome;

      toast.success(`${nameDeleted} excluído com sucesso`);

      await fetchGetAllTypeAdd(); // 🔥 recarrega lista
      handleForceRefreshLists?.(typeAdd); // opcional (atualiza pai)
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (isVisible && typeAdd) {
      fetchGetAllTypeAdd();
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
