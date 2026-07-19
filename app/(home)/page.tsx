"use client";

import { getAllConditionMini } from "@/app/api/condicao_miniatura";
import { getAllScalesMini } from "@/app/api/escala_miniatura";
import { getAllLinesMini } from "@/app/api/linha_miniatura";
import { getAllMarksMini } from "@/app/api/marca_miniatura";
import { getAllTypesMini } from "@/app/api/tipo_miniatura";
import type { TableColumnsType } from "antd";
import { Pagination, Segmented, Table } from "antd";
import { CirclePlus, LayoutGrid, Table as TableIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { deleteMiniById, getFilterMiniatura } from "../api/miniatura";
import { FilterMiniatura } from "../api/miniatura/types";
import { useAuth } from "../hooks/useAuth";
import { useFilter } from "../hooks/useFilter";
import { useLoading } from "../hooks/useLoading";
import { getErrorMessage, toNumberArray } from "../utils";
import { Card } from "./components/Card";
import { Filter } from "./components/Filter";
import { FilterLists } from "./components/Filter/types";
import { MiniActions } from "./components/MiniActions";
import { ModalFormMini } from "./components/ModalFormMini";
import { TypeOfModalAction } from "./components/ModalFormMini/types";
import { ModalPhoto } from "./components/ModalPhoto";
import { Miniatura, PaginationInfo } from "./types";
import { PAGE_INITIAL, PaginationDefault } from "./utils";

export default function Home() {
  const {
    maxPrice,
    amount,
    scale,
    minPrice,
    name,
    year,
    mark,
    line,
    type,
    condition,
  } = useFilter();
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState<"cards" | "table">(
    user ? "table" : "cards",
  );
  const [selectedMini, setSelectedMini] = useState<Miniatura | null>(null);
  const [visibleModalFormMini, setVisibleModalFormMini] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [listMini, setListMini] = useState<Miniatura[]>([]);
  const [pagination, setPagination] =
    useState<PaginationInfo>(PaginationDefault);
  const [pageNumber, setPageNumber] = useState(PAGE_INITIAL);
  const [typeOfModalAction, setTypeOfModalAction] =
    useState<TypeOfModalAction>("add");
  const [filterLists, setFilterLists] = useState<FilterLists>({
    marks: [],
    types: [],
    lines: [],
    conditions: [],
    scales: [],
  });

  const handleVisibleFormMini = (type: TypeOfModalAction) => {
    setTypeOfModalAction(type);
    setVisibleModalFormMini((e) => !e);
  };

  useEffect(() => {
    if (visibleModalFormMini === false) {
      setTypeOfModalAction("add");
      handleSelectedMini(null);
    }
  }, [visibleModalFormMini]);

  const boldTitle = (text: string) => (
    <span className="font-bold text-lg">{text}</span>
  );

  const columns: TableColumnsType<Miniatura> = [
    {
      title: boldTitle("Nome"),
      dataIndex: "nome",
      key: "nome",
      align: "center",
    },
    {
      title: boldTitle("Qtd. Estoque"),
      dataIndex: "quantidadeEstoque",
      key: "quantidadeEstoque",
      align: "center",
      width: 50,
    },
    {
      title: boldTitle("Qtd. Disponível"),
      dataIndex: "quantidadeDisponivel",
      key: "quantidadeDisponivel",
      align: "center",
      width: 50,
    },
    {
      title: boldTitle("Qtd. em Garagem"),
      dataIndex: "quantidadeEmGaragem",
      key: "quantidadeEmGaragem",
      align: "center",
      width: 50,
    },
    {
      title: boldTitle("Marca"),
      dataIndex: ["marca", "nome"],
      key: "marca",
      align: "center",
    },
    {
      title: boldTitle("Linha"),
      dataIndex: ["linha", "nome"],
      key: "linha",
      align: "center",
    },
    // {
    //   title: boldTitle("Tipo"),
    //   dataIndex: "tipos",
    //   key: "tipos",
    //   render: (tipos: { id: number; nome: string }[]) =>
    //     tipos && tipos.length > 0 ? tipos.map((t) => t.nome).join(", ") : "-",
    //   align: "center",
    // },
    {
      title: boldTitle("Escala"),
      dataIndex: ["escala", "nome"],
      key: "escala",
      align: "center",
    },
    // { title: boldTitle("Ano"), dataIndex: "ano", key: "ano", width: 80 },
    {
      title: boldTitle("Condição"),
      dataIndex: ["condicao", "nome"],
      key: "condicao",
      align: "center",
    },
    {
      title: boldTitle("Valor"),
      dataIndex: "valor",
      key: "valor",
      render: (valor) =>
        valor != null
          ? valor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : "-",
      align: "center",
    },
    {
      title: boldTitle("Ações"),
      key: "acoes",
      // width: 85,
      align: "center",
      render: (_, record) => (
        <MiniActions
          mini={record}
          handleSelectedMini={handleSelectedMini}
          handleVisibleFormMini={handleVisibleFormMini}
          handleDeleteMiniById={handleDeleteMiniById}
          variant="table"
        />
      ),
    },
  ];

  const handleSelectedMini = (mini: Miniatura | null) => {
    setSelectedMini(mini);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-35px 0px 0px 0px",
      },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchGetFilterMiniaturas = async () => {
    showLoading();
    window.scrollTo({
      top: 0,
      behavior: "smooth", // opcional (animação)
    });
    const filterPayload: FilterMiniatura = {
      nome: name || null,
      marcaIds: toNumberArray(mark),
      ano: year || null,
      tipoIds: toNumberArray(type),
      linhaIds: toNumberArray(line),
      condicaoIds: toNumberArray(condition),
      escalaIds: toNumberArray(scale),
      precoMin: minPrice ? minPrice / 100 : null,
      precoMax: maxPrice ? maxPrice / 100 : null,
      page: pageNumber === 0 ? 0 : pageNumber - 1,
      size: amount,
    };
    try {
      const { data } = await getFilterMiniatura(filterPayload);
      setListMini(data.content);
      setPagination({
        totalPages: data.totalPages,
        pageSize: data.pageable.pageSize,
        totalElements: data.totalElements,
        elementsPerPage: data.numberOfElements,
      });
      if (data.content.length === 0) {
        setPageNumber(0);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const handleDeleteMiniById = async (mini: Miniatura): Promise<boolean> => {
    showLoading();
    try {
      await deleteMiniById(mini.id);
      refreshMiniList();
      toast.success(`${mini.nome} apagada com sucesso`);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      hideLoading();
    }
  };

  const refreshMiniList = () => {
    setPageNumber(PAGE_INITIAL);
    if (pageNumber === 0) {
      fetchGetFilterMiniaturas();
    }
  };

  const fetchGetAllTypes = async () => {
    showLoading();
    try {
      const response = await getAllTypesMini();

      setFilterLists((prev) => ({
        ...prev,
        types: response.data,
      }));
    } finally {
      hideLoading();
    }
  };

  const fetchGetAllMarks = async () => {
    showLoading();
    try {
      const response = await getAllMarksMini();

      setFilterLists((prev) => ({
        ...prev,
        marks: response.data,
      }));
    } finally {
      hideLoading();
    }
  };

  const fetchGetAllLines = async () => {
    showLoading();
    try {
      const response = await getAllLinesMini();

      setFilterLists((prev) => ({
        ...prev,
        lines: response.data,
      }));
    } finally {
      hideLoading();
    }
  };

  const fetchGetAllConditions = async () => {
    showLoading();
    try {
      const response = await getAllConditionMini();
      setFilterLists((prev) => ({
        ...prev,
        conditions: response.data,
      }));
    } finally {
      hideLoading();
    }
  };

  const fetchGetAllScales = async () => {
    showLoading();
    try {
      const response = await getAllScalesMini();

      setFilterLists((prev) => ({
        ...prev,
        scales: response.data,
      }));
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchGetAllTypes();
    fetchGetAllMarks();
    fetchGetAllLines();
    fetchGetAllConditions();
    fetchGetAllScales();
  }, []);

  useEffect(() => {
    fetchGetFilterMiniaturas();
  }, [pageNumber]);

  const renderMiniList = () => {
    if (!hasMiniInList) {
      return (
        <div className="w-full flex items-center justify-center mb-44">
          <div className="flex flex-col items-center text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-2xl font-semibold text-gray-700">
              Nenhuma miniatura encontrada
            </p>
            <p className="text-gray-500 mt-2">
              Tente ajustar os filtros ou buscar por outro nome
            </p>
          </div>
        </div>
      );
    }

    if (showTable) {
      return (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={listMini}
          pagination={false}
          scroll={{ x: true }}
        />
      );
    }

    return (
      <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max items-start">
        {listMini.map((mini) => (
          <Card
            key={mini.id}
            mini={mini}
            handleSelectedMini={handleSelectedMini}
            handleVisibleFormMini={handleVisibleFormMini}
            refreshMiniList={refreshMiniList}
            handleDeleteMiniById={handleDeleteMiniById}
          />
        ))}
      </div>
    );
  };

  const hasMiniInList = listMini.length > 0;
  const showTable = viewMode === "table" && user?.role === "ADMIN";

  return (
    <div className="flex flex-col items-center pb-5 w-full">
      {/* <Drawer
        isVisible={menuVisibility}
        handleVisibility={handleVisibilityMenu}
      />
      <Header handleVisibilityMenu={handleVisibilityMenu} /> */}
      <div className="flex justify-center pt-12 relative">
        {user?.role === "ADMIN" && (
          <div className="flex justify-end absolute right-1/200 p-3.5 top-0 cursor-pointer ">
            <CirclePlus
              color="#1f3565"
              width={36}
              height={36}
              className="ml-5 hover:scale-110 transition-all duration-300 ease-out"
              onClick={() => handleVisibleFormMini("add")}
            />
          </div>
        )}
        <div ref={sentinelRef} className="h-[1px]" />{" "}
        <div
          className={`max-md:hidden left-0 mr-2 md:-mr-1.25 md:ml-2 border-blue-600 h-full lg:w-64 md:w-56 border p-4 rounded-lg sticky top-[25px] overflow-y-auto transition-all duration-500
  ${isSticky ? " max-h-[95vh]" : " max-h-[850px] mt-[-35px]"}`}
        >
          {" "}
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <Filter
            handleFilterMiniaturas={fetchGetFilterMiniaturas}
            lists={filterLists}
          />
        </div>
        {/* <div className="max-w-7xl w-[72.5vw] p-4 flex flex-wrap gap-4 justify-start"> */}
        {/* <div className="max-w-7xl sm:w-[80vw] md:w-[70vw] p-4"> */}
        <div
          className={`max-w-7xl p-4 transition-all duration-600 ease-out ${
            showTable ? "sm:w-[85vw] md:w-[75vw]" : "sm:w-[80vw] md:w-[70vw]"
          }`}
        >
          {user?.role === "ADMIN" && (
            <div className="flex justify-end mb-4">
              <Segmented
                value={viewMode}
                orientation="horizontal"
                onChange={(value) => setViewMode(value as "cards" | "table")}
                options={[
                  {
                    value: "cards",
                    icon: (
                      <div className="mt-0.75">
                        <LayoutGrid size={20} />
                      </div>
                    ),
                  },
                  {
                    value: "table",
                    icon: (
                      <div className="mt-0.75">
                        <TableIcon size={20} />{" "}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )}
          {renderMiniList()}
        </div>
        {selectedMini && typeOfModalAction !== "edit" && (
          <ModalPhoto
            selectedMini={selectedMini}
            handleSelectedMini={handleSelectedMini}
          />
        )}
        <ModalFormMini
          type={typeOfModalAction}
          mini={selectedMini}
          visible={visibleModalFormMini}
          handleVisibleFormMini={handleVisibleFormMini}
          refreshMiniList={refreshMiniList}
          refreshMarksList={fetchGetAllMarks}
          refreshTypesList={fetchGetAllTypes}
          refreshLinesList={fetchGetAllLines}
          refreshConditionsList={fetchGetAllConditions}
          refreshScalesList={fetchGetAllScales}
        />
      </div>
      <Pagination
        current={pageNumber}
        pageSize={pagination.pageSize}
        total={pagination.totalElements}
        showSizeChanger={false}
        onChange={(page) => {
          setPageNumber(page);
        }}
      />
    </div>
  );
}
