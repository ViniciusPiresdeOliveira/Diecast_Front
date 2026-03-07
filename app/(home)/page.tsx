"use client";
import { Pagination } from "antd";

import { CirclePlus, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "./components/Card";
import { Filter } from "./components/Filter";
import { ModalFormMini } from "./components/ModalFormMini";
import { ModalPhoto } from "./components/ModalPhoto";
import { Miniatura } from "./types";
import { handleDownloadCatalog, minis } from "./utils";

export default function Home() {
  const [menuVisibility, setMenuVisibility] = useState<boolean>(false);
  const [selectedMini, setSelectedMini] = useState<Miniatura | null>(null);
  const [visibleModalFormMini, setVisibleModalFormMini] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);

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

  console.log("isSticky", isSticky);

  return (
    <div className="flex flex-col items-center pb-5 w-full">
      {/* <Drawer
        isVisible={menuVisibility}
        handleVisibility={handleVisibilityMenu}
      />
      <Header handleVisibilityMenu={handleVisibilityMenu} /> */}
      <div className="flex justify-center pt-16 relative">
        <div className="flex justify-end absolute  right-1/30 p-3.5 top-3 cursor-pointer ">
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
          className={`max-sm:hidden border-blue-600 w-64 border mt-4 ml-4 p-4 rounded-lg sticky top-[25px] overflow-y-auto transition-all duration-500
  ${isSticky ? " max-h-[95vh]" : " max-h-[75vh]"}`}
        >
          {" "}
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <Filter />
        </div>
        <div className="max-w-7xl w-full p-4 flex flex-wrap gap-4 justify-center">
          {minis.map((mini, index) => (
            <Card
              key={index}
              mini={mini}
              handleSelectedMini={handleSelectedMini}
            />
          ))}
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
