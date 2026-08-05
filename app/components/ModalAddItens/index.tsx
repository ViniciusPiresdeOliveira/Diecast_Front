"use client";

import {
  deleteConditionMiniById,
  postConditionMini,
} from "@/app/api/condicao_miniatura";
import { deleteScaleMiniById, postScaleMini } from "@/app/api/escala_miniatura";
import { deleteLineMiniById, postLineMini } from "@/app/api/linha_miniatura";
import { deleteMarkMiniById, postMarkMini } from "@/app/api/marca_miniatura";
import { deleteTypesMiniById, postTypesMini } from "@/app/api/tipo_miniatura";
import { useFilterLists } from "@/app/hooks/useFilterLists";
import { useLoading } from "@/app/hooks/useLoading";
import { GenericGetTypes } from "@/app/types";
import { getErrorMessage } from "@/app/utils";
import { Button, Input, Modal, Space, Table } from "antd";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeleteConfirmModal } from "../Modal/Delete";
import { ModalAddItensProps } from "./types";

export const ModalAddItens = ({
  title,
  typeAdd,
  loading,
  isVisible,
  handleVisibility,
}: ModalAddItensProps) => {
  const { hideLoading, showLoading } = useLoading();
  const { filterLists, handleChangeFilterLists } = useFilterLists();

  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const filterListsKeyMap = {
    marca: "marks",
    tipos: "types",
    linha: "lines",
    condicao: "conditions",
    escala: "scales",
  } as const;

  const updateFilterListByType = (
    type: typeof typeAdd,
    updatedList: GenericGetTypes[],
  ) => {
    const key = filterListsKeyMap[type];

    handleChangeFilterLists({
      [key]: updatedList,
    } as Partial<typeof filterLists>);
  };

  const listData = filterLists[filterListsKeyMap[typeAdd]];

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
      const { data } = await createMethod({ nome: value });
      toast.success(`${value} criado com sucesso`);

      updateFilterListByType(typeAdd, [
        ...filterLists[filterListsKeyMap[typeAdd]],
        data,
      ]);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setValue("");
      hideLoading();
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRecord, setSelectedRecord] = useState<GenericGetTypes | null>(
    null,
  );

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
          <Button
            danger
            size="small"
            className="transition-all duration-300 ease-out hover:scale-110"
            icon={<Trash2 size={14} />}
            onClick={() => {
              setSelectedRecord(record);
              setIsDeleteModalOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

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
      const nameDeleted = listData?.find((e) => e.id === id)?.nome;

      toast.success(`${nameDeleted} excluído com sucesso`);

      updateFilterListByType(
        typeAdd,
        filterLists[filterListsKeyMap[typeAdd]].filter(
          (item) => item.id !== id,
        ),
      );
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      hideLoading();
    }
  };

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

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        title={`Excluir ${typeAdd}`}
        message="Tem certeza que deseja excluir "
        nameSpecific={selectedRecord?.nome}
        onConfirm={() => {
          if (selectedRecord) {
            handleDeleteByType(selectedRecord.id);
          }
          setIsDeleteModalOpen(false);
          setSelectedRecord(null);
        }}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedRecord(null);
        }}
        confirmText="Sim"
        cancelText="Não"
      />
    </Modal>
  );
};
