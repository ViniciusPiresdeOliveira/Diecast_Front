"use client";
import { Pagination } from "antd";

import { CirclePlus, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getFilterMiniatura } from "../api/miniatura";
import { FilterMiniatura } from "../api/miniatura/types";
import { useFilter } from "../hooks/useFilter";
import { useLoading } from "../hooks/useLoading";
import { Card } from "./components/Card";
import { Filter } from "./components/Filter";
import { ModalFormMini } from "./components/ModalFormMini";
import { ModalPhoto } from "./components/ModalPhoto";
import { Miniatura } from "./types";
import { handleDownloadCatalog } from "./utils";

export default function Home() {
  const [menuVisibility, setMenuVisibility] = useState<boolean>(false);
  const [selectedMini, setSelectedMini] = useState<Miniatura | null>(null);
  const [visibleModalFormMini, setVisibleModalFormMini] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [listMini, setListMini] = useState<Miniatura[]>([]);

  const handleVisibleFormMini = () => {
    setVisibleModalFormMini((e) => !e);
  };

  const handleSelectedMini = (mini: Miniatura | null) => {
    setSelectedMini(mini);
  };

  const handleVisibilityMenu = () => {
    setMenuVisibility((e) => !e);
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
  } = useFilter();
  const { showLoading, hideLoading } = useLoading();

  const filterPayload: FilterMiniatura = {
    nome: name || null,
    marcaId: mark || null,
    ano: year || null,
    tipoId: type || null,
    linhaId: line || null,
    status: status || null,
    escala: scale || null,
    precoMin: minPrice || null,
    precoMax: maxPrice ?? null,
    page: 0,
    size: Number(amount),
  };

  const fetchGetFilterMiniaturas = async () => {
    showLoading();
    try {
      const { data } = await getFilterMiniatura(filterPayload);
      setListMini(data.content);
    } catch (error) {
      console.log("responseeee 2", error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchGetFilterMiniaturas();
  }, []);

  return (
    <div className="flex flex-col items-center pb-5 w-full">
      {/* <Drawer
        isVisible={menuVisibility}
        handleVisibility={handleVisibilityMenu}
      />
      <Header handleVisibilityMenu={handleVisibilityMenu} /> */}
      <div className="flex justify-center pt-12 relative">
        <div className="flex justify-start absolute left-6/29 p-3.5 top-0 cursor-pointer ">
          <Download
            color="#1f3565"
            width={36}
            height={36}
            onClick={handleDownloadCatalog}
          />
          <CirclePlus
            color="#1f3565"
            width={36}
            height={36}
            className="ml-5"
            onClick={handleVisibleFormMini}
          />
        </div>
        <div ref={sentinelRef} className="h-[1px]" />{" "}
        <div
          className={`max-sm:hidden left-0  border-blue-600 h-full w-64 border ml-4 p-4 rounded-lg sticky top-[25px] overflow-y-auto transition-all duration-500
  ${isSticky ? " max-h-[95vh]" : " max-h-[790px] mt-[-32px]"}`}
        >
          {" "}
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <Filter handleFilterMiniaturas={fetchGetFilterMiniaturas} />
        </div>
        <div className="max-w-7xl w-full p-4 flex flex-wrap gap-4 justify-center">
          {listMini.length > 0 ? (
            listMini.map((mini, index) => (
              <Card
                key={index}
                mini={mini}
                handleSelectedMini={handleSelectedMini}
              />
            ))
          ) : (
            <div className="w-[71vw] flex items-center justify-center mb-44">
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
        {selectedMini && (
          <ModalPhoto
            selectedMini={selectedMini}
            handleSelectedMini={handleSelectedMini}
          />
        )}
        <ModalFormMini
          type="add"
          mini={null}
          visible={visibleModalFormMini}
          handleVisibleFormMini={handleVisibleFormMini}
        />
      </div>
      <Pagination total={100} pageSize={10} />
    </div>
  );
}
