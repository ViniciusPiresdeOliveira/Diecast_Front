"use client";
import { Pagination, Select } from "antd";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card } from "./components/Card";
import { Drawer } from "./components/Drawer";
import { ModalPhoto } from "./components/ModalPhoto";
import { minis } from "./utils";

export default function Home() {
  const [menuVisibility, setMenuVisibility] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [age, setAge] = useState("10");

  const handleSelectedImage = (image: string | null) => {
    setSelectedImage(image);
  };

  const handleChange = (value: string) => {
    setAge(value);
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
      <div className="w-full h-full p-5 flex justify-between items-center bg-[#1F3565] border-b-[#F31A13] border-b-3">
        <div className="flex items-center gap-2 pl-2">
          <Image
            src="/image/logo.jpg"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full object-contain"
          />
          <p className="text-white font-semibold">Diecast</p>
        </div>
        <button className="p-2 cursor-pointer" onClick={handleVisibilityMenu}>
          <Menu color="white" />
        </button>
      </div>
      <div className="max-w-6xl w-full p-5 pr-11 flex justify-end">
        <div className="max-w-16 w-full">
          <label className="text-sm font-medium text-gray-700 ">Minis</label>
          <Select
            value={age}
            onChange={handleChange}
            placeholder="Selecione"
            className="w-full"
            options={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "30", label: "30" },
              { value: "40", label: "40" },
              { value: "50", label: "50" },
            ]}
          />
        </div>
      </div>
      <div className="min-h-screen flex justify-center">
        <div className="max-w-6xl w-full p-4 flex flex-wrap gap-4 justify-center">
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
      <Pagination className="max-w-2" total={100} pageSize={10} />
    </div>
  );
}
