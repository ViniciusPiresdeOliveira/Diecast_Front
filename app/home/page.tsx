"use client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { minis } from "./utils";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [age, setAge] = useState("10");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const stylesMiniWithCar = "relative";
  const stylesMiniWithoutCar = "flex items-center justify-center";

  return (
    <div className="flex flex-col items-center pb-5 w-full">
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
            <div
              key={index}
              className="
                        group
                        bg-zinc-100 text-zinc-100
                        p-4 rounded-xl
                        w-full sm:w-[48%] lg:w-[31%]
                        flex gap-4 items-center
                        border border-blue-300
                        transition-all duration-300 ease-out
                        hover:-translate-y-1
                        hover:bg-[#e6ecf2]
                        hover:shadow-md hover:shadow-black/30
                        hover:border-blue-700
                      "
            >
              <div
                className={
                  "w-40 h-40 rounded-md overflow-hidden z-10 " +
                  (mini.image ? stylesMiniWithCar : stylesMiniWithoutCar)
                }
              >
                {mini.image ? (
                  <Image
                    src={mini.image}
                    alt={mini.name}
                    fill
                    className="object-contain z-10 transition-transform duration-300 group-hover:scale-110"
                    onClick={() => {
                      setSelectedImage(mini.image as string);
                    }}
                  />
                ) : (
                  <ImageOff className="w-12 h-12 text-blue-300 group-hover:text-blue-700 transition-colors" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-md">
                  <span className="text-zinc-800 font-semibold">Nome:</span>{" "}
                  <span className="font-medium text-zinc-600">{mini.name}</span>
                </p>

                <p className="text-md text-zinc-800 font-semibold">
                  Ano:{" "}
                  <span className="text-zinc-600 font-light">{mini.ano}</span>
                </p>

                <p className="text-md text-blue-700 font-semibold ">
                  R$ {mini.preco.toFixed(2)}
                </p>
              </div>
            </div>
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
