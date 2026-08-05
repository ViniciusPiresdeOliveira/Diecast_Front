"use client";

import { deleteClientById, getAllClientsByTerm } from "@/app/api/cliente";
import { Cliente } from "@/app/api/cliente/types";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { getErrorMessage } from "@/app/utils";
import type { TableColumnsType } from "antd";
import { Input, Table } from "antd";
import { CirclePlus, Warehouse } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Miniatura } from "../types";

export default function Home() {
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();

  const [listClients, setListClients] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const boldTitle = (text: string) => (
    <span className="font-bold text-lg">{text}</span>
  );

  const columns: TableColumnsType<Cliente> = [
    {
      title: boldTitle("Nome"),
      dataIndex: "nome",
      key: "nome",
      align: "center",
    },
    {
      title: boldTitle("Telefone"),
      dataIndex: "telefone",
      key: "telefone",
      align: "center",
    },
    {
      title: boldTitle("Cep"),
      dataIndex: "cep",
      key: "cep",
      align: "center",
    },
    {
      title: boldTitle("Número Residência"),
      dataIndex: "numeroResidencia",
      key: "numeroResidencia",
      align: "center",
    },
    {
      title: boldTitle("Ações"),
      key: "acoes",
      align: "center",
      render: (_, record) => <Warehouse size={22} color="#1f3565" />,
    },
  ];

  const handleSelectedMini = (mini: Miniatura | null) => {
    // setSelectedMini(mini);
  };

  const fetchGetFilterClientsByTerm = async (termo: string) => {
    showLoading();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    try {
      const { data } = await getAllClientsByTerm(termo);
      setListClients(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const handleDeleteClientById = async (mini: Miniatura): Promise<boolean> => {
    showLoading();
    try {
      await deleteClientById(mini.id);
      fetchGetFilterClientsByTerm(searchTerm);
      toast.success(`${mini.nome} apagado com sucesso`);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      hideLoading();
    }
  };

  // Busca inicial ao carregar / trocar usuário
  useEffect(() => {
    if (user !== undefined) {
      fetchGetFilterClientsByTerm(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Debounce: dispara a busca 400ms depois que o usuário para de digitar
  useEffect(() => {
    if (user === undefined) return;

    const timer = setTimeout(() => {
      fetchGetFilterClientsByTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="flex flex-col items-center pb-5 w-full">
      <div className="flex justify-center pt-12 relative">
        <div className="flex justify-end absolute right-1/200 p-3.5 top-0 cursor-pointer ">
          <CirclePlus
            color="#1f3565"
            width={36}
            height={36}
            className="ml-5 hover:scale-110 transition-all duration-300 ease-out"
            onClick={() => {}}
          />
        </div>
        <div
          className={`max-w-7xl p-4 transition-all duration-600 ease-out sm:w-[85vw] md:w-[75vw]"
          }`}
        >
          <Input
            placeholder="Buscar por nome, telefone, cep ou número..."
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onSearch={(value) => fetchGetFilterClientsByTerm(value)}
            className="mb-4"
          />

          <Table
            rowKey="id"
            columns={columns}
            dataSource={listClients}
            pagination={false}
            scroll={{ x: true }}
          />
        </div>
      </div>
    </div>
  );
}
