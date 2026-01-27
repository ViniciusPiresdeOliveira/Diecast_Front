"use client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
} from "@mui/material";
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

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
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
        <div className="max-w-60">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Mini</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={40}>40</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
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
      <Pagination count={10} />
    </div>
  );
}
