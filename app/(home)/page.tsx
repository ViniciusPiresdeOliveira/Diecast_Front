"use client";
import { Pagination } from "antd";

import { getAllScalesMini } from "@/app/api/escala_miniatura";
import { getAllLinesMini } from "@/app/api/linha_miniatura";
import { getAllMarksMini } from "@/app/api/marca_miniatura";
import { getAllStatusMini } from "@/app/api/status_miniatura";
import { getAllTypesMini } from "@/app/api/tipo_miniatura";
import { CirclePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getFilterMiniatura } from "../api/miniatura";
import { FilterMiniatura } from "../api/miniatura/types";
import { useFilter } from "../hooks/useFilter";
import { useLoading } from "../hooks/useLoading";
import { GenericGetTypes } from "../types";
import { toNumberArray } from "../utils";
import { Card } from "./components/Card";
import { Filter } from "./components/Filter";
import { FilterLists } from "./components/Filter/types";
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
    status,
    clearFilters,
  } = useFilter();
  const { showLoading, hideLoading } = useLoading();

  const [menuVisibility, setMenuVisibility] = useState<boolean>(false);
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
  const [listMarksMini, setListMarksMini] = useState<GenericGetTypes[]>([]);
  const [listTypesMini, setListTypesMini] = useState<GenericGetTypes[]>([]);
  const [listLinesMini, setListLinesMini] = useState<GenericGetTypes[]>([]);
  const [listStatusMini, setListStatusMini] = useState<GenericGetTypes[]>([]);
  const [listScalesMini, setListScalesMini] = useState<GenericGetTypes[]>([]);
  const [filterLists, setFilterLists] = useState<FilterLists>({
    marks: [],
    types: [],
    lines: [],
    status: [],
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

  console.log("name eee 1", name);
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
      statusIds: toNumberArray(status),
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
      toast.error("Erro ao recuperar lista de miniaturas");
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

  // const fetchGetAllScalesMini = async () => {
  //   showLoading();
  //   try {
  //     const { data } = await getAllScalesMini();
  //     setListScalesMini(data);
  //   } catch (e) {
  //   } finally {
  //     hideLoading();
  //   }
  // };

  // const fetchGetAllTypesMini = async () => {
  //   showLoading();
  //   try {
  //     const { data } = await getAllTypesMini();
  //     setListTypesMini(data);
  //   } catch (e) {
  //   } finally {
  //     hideLoading();
  //   }
  // };

  // const fetchGetAllMarksMini = async () => {
  //   showLoading();
  //   try {
  //     const { data } = await getAllMarksMini();
  //     setListMarksMini(data);
  //   } catch (e) {
  //   } finally {
  //     hideLoading();
  //   }
  // };

  // const fetchGetAllLinesMini = async () => {
  //   showLoading();
  //   try {
  //     const { data } = await getAllLinesMini();
  //     setListLinesMini(data);
  //   } catch (e) {
  //   } finally {
  //     hideLoading();
  //   }
  // };

  // const fetchGetAllStatusMini = async () => {
  //   showLoading();
  //   try {
  //     const { data } = await getAllStatusMini();
  //     setListStatusMini(data);
  //   } catch (e) {
  //   } finally {
  //     hideLoading();
  //   }
  // };

  console.log("pagination", pagination);

  useEffect(() => {
    // if (pagination.pageNumber !== 0) {
    fetchGetFilterMiniaturas();
    // }
  }, [pageNumber]);

  // useEffect(() => {
  //   fetchGetAllTypesMini();
  //   fetchGetAllMarksMini();
  //   fetchGetAllLinesMini();
  //   fetchGetAllStatusMini();
  //   fetchGetAllScalesMini();
  // }, []);

  const fetchAllFilter = async () => {
    showLoading();
    try {
      const [types, marks, lines, status, scales] = await Promise.all([
        getAllTypesMini(),
        getAllMarksMini(),
        getAllLinesMini(),
        getAllStatusMini(),
        getAllScalesMini(),
      ]);

      setFilterLists({
        types: types.data,
        marks: marks.data,
        lines: lines.data,
        status: status.data,
        scales: scales.data,
      });
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchAllFilter();
  }, []);
  console.log("pagination", pagination);

  const hasMiniInList = listMini.length > 0;
  return (
    <div className="flex flex-col items-center pb-5 w-full">
      {/* <Drawer
        isVisible={menuVisibility}
        handleVisibility={handleVisibilityMenu}
      />
      <Header handleVisibilityMenu={handleVisibilityMenu} /> */}
      <div className="flex justify-center pt-12 relative">
        <div className="flex justify-end absolute right-1/200 p-3.5 top-0 cursor-pointer ">
          {/* <Download
            color="#1f3565"
            width={36}
            height={36}
            onClick={handleDownloadCatalog}
          /> */}
          <CirclePlus
            color="#1f3565"
            width={36}
            height={36}
            className="ml-5"
            onClick={() => handleVisibleFormMini("add")}
          />
        </div>
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
        <div
          className={`max-w-7xl sm:w-[80vw] md:w-[70vw] p-4 ${
            hasMiniInList
              ? "grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max items-start"
              : ""
          }`}
        >
          {hasMiniInList ? (
            listMini.map((mini) => (
              <Card
                key={mini.id}
                mini={mini}
                handleSelectedMini={handleSelectedMini}
                handleVisibleFormMini={handleVisibleFormMini}
                refreshMiniList={refreshMiniList}
              />
            ))
          ) : (
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
          )}
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
