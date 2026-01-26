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
import { minis } from "./utils";

export default function Home() {
  const [menuVisibility, setMenuVisibility] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [age, setAge] = useState("10");

  const handleSelectedImage = (image: string) => {
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
        <div className="flex items-center gap-2">
          <Image
            src="/image/logo.jpg"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full object-contain"
          />
          <p className="text-white font-semibold">Diecast</p>
        </div>
        <Menu
          color="white"
          className="cursor-pointer"
          onClick={handleVisibilityMenu}
        />
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
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center transition-all duration-300 ease-out"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-9 text-white text-3xl hover:text-red-400 z-50"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>

              <div className="overflow-auto max-h-[85vh]">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="mx-auto max-w-full cursor-zoom-in transition-transform duration-300 hover:scale-110"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Pagination count={10} />
    </div>
  );
}
