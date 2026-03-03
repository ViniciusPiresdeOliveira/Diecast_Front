"use client";

import { ImageNotFound } from "@/app/components/ImageNotFound";
import { Image as ImageANTD } from "antd";
import { useRouter } from "next/navigation";
import { MiniCardProps } from "./types";

export const MiniCard = ({ mini, className }: MiniCardProps) => {
  const router = useRouter();

  return (
    <div
      className={`mb-9 rounded-xl w-[175px] h-[400px] shadow-md p-4 flex flex-col items-center gap-3 transition-all duration-300 border border-blue-300 hover:border-blue-700 mx-auto  ${className}`}
    >
      {mini.image ? (
        <ImageANTD
          src={mini.image}
          alt={mini.name}
          width={200}
          height={200}
          className="object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center group transition-colors">
          <ImageNotFound className="object-contain" />
        </div>
      )}

      <div className="flex flex-col justify-around items-center h-full">
        <h3 className="font-semibold text-center">
          {mini.marca} {mini.name}
        </h3>

        <p className="font-bold text-lg">R$ {mini.preco}</p>

        <button
          onClick={() => router.push(`/mini/${mini.id}`)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          Detalhe
        </button>
      </div>
    </div>
  );
};
