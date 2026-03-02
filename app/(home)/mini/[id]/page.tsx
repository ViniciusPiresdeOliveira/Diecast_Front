"use client";
import { ImageNotFound } from "@/app/components/ImageNotFound";
import { useCurrentUrl } from "@/app/hooks/useCurrentUrl";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Image as ImageANTD } from "antd";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { Miniatura } from "../../types";
import { handleRedirectToWhatsApp, minis } from "../../utils";
import { MiniCard } from "./components/CardCarousel";
import { optionsCarousel } from "./utils";

export default function MiniDetail() {
  const params = useParams();
  const link = useCurrentUrl();

  const id = Number(params.id);

  const mini = minis.find((item: Miniatura) => item.id === id);

  if (!mini) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="flex justify-center gap-8">
        <div className="w-[80%] max-w-[400px]">
          {mini.image ? (
            <ImageANTD
              src={mini.image}
              alt={mini.name}
              rootClassName="custom-image"
              style={{ width: "100%", height: "auto" }}
              className="object-contain cursor-pointer z-10 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center group transition-colors">
              <ImageNotFound className="object-contain cursor-pointer z-10 transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}
        </div>
        <div className=" max-w-[500px]">
          <h1 className="text-2xl font-bold mb-4">
            {mini.marca} {mini.name} - {mini.ano}
          </h1>

          <p className="text-4xl font-bold">R${mini.preco}</p>
          <div className="mt-4">
            <p className="text-start md:text-left text-gray-600 mb-2">
              Interessado nesta miniatura? Entre em contato pelo WhatsApp e
              garanta sua reserva!
            </p>
            <button
              className="z-20 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 flex items-center gap-2"
              onClick={() => handleRedirectToWhatsApp(mini, link)}
            >
              <Image
                color="#eefr"
                src="/whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
              />
              Falar no WhatsApp
            </button>
          </div>
        </div>
      </div>
      <div className="mt-16 w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Outras minis</h2>

        <Splide options={optionsCarousel}>
          {minis
            .filter((item) => item.id !== mini.id)
            .map((item) => (
              <SplideSlide key={item.id}>
                <MiniCard mini={item} />
              </SplideSlide>
            ))}
        </Splide>
      </div>
    </div>
  );
}
