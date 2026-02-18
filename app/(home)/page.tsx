"use client";
import { Pagination } from "antd";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card } from "./components/Card";
import { Drawer } from "./components/Drawer";
import { Filter } from "./components/Filter";
import { ModalPhoto } from "./components/ModalPhoto";
import { minis } from "./utils";

export default function Home() {
  const [menuVisibility, setMenuVisibility] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSelectedImage = (image: string | null) => {
    setSelectedImage(image);
  };

  const handleVisibilityMenu = () => {
    setMenuVisibility((e) => !e);
  };

  return (
    <div className="flex flex-col items-center pb-5 w-full">
      <Drawer
        isVisible={menuVisibility}
        handleVisibility={handleVisibilityMenu}
      />
      <div className="w-full h-full p-5 flex justify-between items-center bg-blue-primary border-b-red-primary border-b-3">
        <div className="flex items-center gap-2 pl-2 ">
          <Image
            src="/image/logo.jpg"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full object-contain"
          />
          <p className="text-white font-semibold">Diecast</p>
        </div>
        <button
          className="p-2 cursor-pointer min-sm:hidden"
          onClick={handleVisibilityMenu}
        >
          <Menu color="white" />
        </button>
      </div>
      <div className="flex justify-center pt-16">
        <div className="max-sm:hidden border-blue-600 h-1/2 border mt-4 overflow-y-auto ml-4 p-4 w-64 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>

          <Filter />
        </div>

        <div className="max-w-7xl w-full p-4 flex flex-wrap gap-4 justify-center">
          {minis.map((mini, index) => (
            <Card
              key={index}
              mini={mini}
              handleSelectedImage={handleSelectedImage}
            />
          ))}
        </div>
        {selectedImage && (
          <ModalPhoto
            selectedImage={selectedImage}
            handleSelectedImage={handleSelectedImage}
          />
        )}
      </div>
      <Pagination total={100} pageSize={10} />
    </div>
  );
}
