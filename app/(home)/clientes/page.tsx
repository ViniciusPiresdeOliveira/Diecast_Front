"use client";

import { deleteClientById, getAllClientsByTerm } from "@/app/api/cliente";
import { Cliente } from "@/app/api/cliente/types";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { formatCep, formatTelefone, getErrorMessage } from "@/app/utils";
import type { TableColumnsType } from "antd";
import { Input, Table } from "antd";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClientActions } from "./components/ClientActions";
import { ModalFormCliente } from "./components/ModalFormClient";

export default function Home() {
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();

  const [listClients, setListClients] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  // Controle do modal de form
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formType, setFormType] = useState<"add" | "edit">("add");

  const boldTitle = (text: string) => (
    <span className="font-bold text-lg">{text}</span>
  );

  const handleSelectedClient = (client: Cliente) => {
    setSelectedClient(client);
  };

  // Abre o modal — "add" limpa o cliente selecionado, "edit" mantém o já setado
  const handleVisibleFormClient = (mode: "add" | "edit") => {
    if (isFormVisible) {
      // fechando o modal
      setIsFormVisible(false);
      setSelectedClient(null);
      return;
    }

    if (mode === "add") {
      setSelectedClient(null);
    }
    setFormType(mode);
    setIsFormVisible(true);
  };

  const columns: TableColumnsType<Cliente> = [
    {
      title: boldTitle("Nome"),
      dataIndex: "nome",
      key: "nome",
      align: "center",
      width: "30%",
    },
    {
      title: boldTitle("Telefone"),
      dataIndex: "telefone",
      key: "telefone",
      align: "center",
      width: "15%",
      render: (telefone: string) => formatTelefone(telefone),
    },
    {
      title: boldTitle("Cep"),
      dataIndex: "cep",
      key: "cep",
      align: "center",
      width: "15%",
      render: (cep: string) => formatCep(cep),
    },
    {
      title: boldTitle("Número Residência"),
      dataIndex: "numeroResidencia",
      key: "numeroResidencia",
      align: "center",
      width: "15%",
    },
    {
      title: boldTitle("Ações"),
      key: "acoes",
      align: "center",
      width: "25%",
      render: (_, record) => (
        <ClientActions
          cliente={record}
          handleSelectedClient={handleSelectedClient}
          handleVisibleFormClient={() => handleVisibleFormClient("edit")}
          handleDeleteClientById={handleDeleteClientById}
          handleOpenGaragem={(cliente) => {
            /* navegar/abrir garagem do cliente */
          }}
        />
      ),
    },
  ];

  const fetchGetFilterClientsByTerm = async () => {
    showLoading();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    try {
      const { data } = await getAllClientsByTerm(searchTerm);
      setListClients(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const handleDeleteClientById = async (mini: Cliente): Promise<boolean> => {
    showLoading();
    try {
      await deleteClientById(mini.id);
      fetchGetFilterClientsByTerm();
      toast.success(`${mini.nome} apagado com sucesso`);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (user !== undefined) {
      fetchGetFilterClientsByTerm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user === undefined) return;

    const timer = setTimeout(() => {
      fetchGetFilterClientsByTerm();
    }, 700);

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
            onClick={() => handleVisibleFormClient("add")}
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

      <ModalFormCliente
        visible={isFormVisible}
        cliente={selectedClient}
        handleVisibleFormCliente={handleVisibleFormClient}
        type={formType}
        refreshClienteList={fetchGetFilterClientsByTerm}
      />
    </div>
  );
}
