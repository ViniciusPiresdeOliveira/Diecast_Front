import { ImageOff } from "lucide-react";
import Image from "next/image";
import { CardProps } from "./types";

export const Card = ({ mini, handleSelectedImage }: CardProps) => {
  const stylesMiniWithCar = "relative";
  const stylesMiniWithoutCar = "flex items-center justify-center";
  return (
    <div
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
              handleSelectedImage(mini.image as string);
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
          Ano: <span className="text-zinc-600 font-light">{mini.ano}</span>
        </p>

        <p className="text-md text-blue-700 font-semibold ">
          R$ {mini.preco.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
