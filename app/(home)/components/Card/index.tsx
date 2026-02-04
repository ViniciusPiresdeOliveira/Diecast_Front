import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ModalFormMini } from "../ModalFormMini";
import { CardProps } from "./types";

export const Card = ({ mini, handleSelectedImage }: CardProps) => {
  const stylesMiniWithCar = "relative";
  const stylesMiniWithoutCar = "flex items-center justify-center";

  const [visibleModalFormMini, setVisibleModalFormMini] = useState(false);

  const handleVisibleFormMini = () => {
    setVisibleModalFormMini((e) => !e);
  };

  return (
    <>
      <div
        className="
      group bg-zinc-100 text-zinc-100
      py-4 px-1 rounded-xl
      w-full md:w-[48%] xl:w-[31%]
      flex items-center
      border border-blue-300
      transition-all duration-300 ease-out
      hover:-translate-y-1
      hover:bg-[#e6ecf2]
      hover:shadow-md hover:shadow-black/30
      hover:border-blue-700
      shrink-0
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
              className="object-contain cursor-pointer z-10 transition-transform duration-300 group-hover:scale-110"
              onClick={() => {
                handleSelectedImage(mini.image as string);
              }}
            />
          ) : (
            <ImageOff className="w-12 h-12 text-blue-300 group-hover:text-blue-700 transition-colors" />
          )}
        </div>
        <button
          onClick={handleVisibleFormMini}
          className="flex-1 flex flex-col gap-1 h-full justify-evenly items-start cursor-pointer text-left"
        >
          <p className="grid grid-cols-[65px_1fr] text-lg w-full">
            <span className="text-zinc-800 font-bold">Nome:</span>{" "}
            <span className="font-medium text-zinc-600">{mini.name}</span>
          </p>

          <p className="grid grid-cols-[45px_1fr] text-lg w-full">
            <span className="text-zinc-800 font-bold">Ano:</span>
            <span className="text-zinc-600 font-medium">{mini.ano}</span>
          </p>

          <p className="text-lg text-blue-700 font-bold">
            R$ {mini.preco.toFixed(2)}
          </p>
        </button>
      </div>
      {visibleModalFormMini && (
        <ModalFormMini
          title="Editar Miniatura"
          visible={visibleModalFormMini}
          mini={mini}
          handleVisibleFormMini={handleVisibleFormMini}
        />
      )}
    </>
  );
};
