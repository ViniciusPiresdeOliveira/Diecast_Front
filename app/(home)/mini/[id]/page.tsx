"use client";
import { getMiniById, getSimilarMiniaturesById } from "@/app/api/miniatura";
import { ImageNotFound } from "@/app/components/ImageNotFound";
import { useCurrentUrl } from "@/app/hooks/useCurrentUrl";
import { useLoading } from "@/app/hooks/useLoading";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Image as ImageANTD } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Miniatura } from "../../types";
import { formatImage, handleRedirectToWhatsApp } from "../../utils";
import { MiniCard } from "./components/CardCarousel";
import { optionsCarousel } from "./utils";

export default function MiniDetail() {
  const [mini, setMini] = useState<Miniatura>();
  const [similiarMinis, setSimiliarMinis] = useState<Miniatura[]>([]);
  const params = useParams();
  const link = useCurrentUrl();
  const { isMobile } = useTypeDevice();
  const { hideLoading, showLoading } = useLoading();

  const id = Number(params.id);

  const fetchData = async () => {
    showLoading();

    try {
      const [miniRes, similarRes] = await Promise.all([
        getMiniById(id),
        getSimilarMiniaturesById(id),
      ]);

      setMini(miniRes.data);
      setSimiliarMinis(similarRes.data);
    } catch (error) {
      toast.error("Erro ao carregar dados da miniatura");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  return (
    <div className="p-8">
      <div className="flex flex-col items-center md:flex-row md:justify-center md:items-start gap-8">
        <div className="w-[80%] max-w-[400px]">
          {mini?.imagem ? (
            <ImageANTD
              src={formatImage(mini.imagem)}
              alt={mini.nome}
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
        <div className="max-w-[400px] md:max-w-[500px] ">
          <h1 className="text-2xl font-bold mb-4">
            {mini?.marca.nome} {mini?.nome} - {mini?.ano}
          </h1>

          <p className="text-4xl font-bold">R${mini?.valor}</p>
          <div className="mt-4">
            <p className="text-start md:text-left text-gray-600 mb-2">
              Interessado nesta miniatura? Entre em contato pelo WhatsApp e
              garanta sua reserva!
            </p>
            {mini && (
              <button
                className="z-20 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 flex items-center gap-2"
                onClick={() => handleRedirectToWhatsApp(mini, link, isMobile)}
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
            )}
          </div>
        </div>
      </div>
      <div className="mt-16 w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Outras minis</h2>

        <Splide key={similiarMinis.length} options={optionsCarousel}>
          {similiarMinis.map((item) => (
            <SplideSlide key={item.id}>
              <MiniCard mini={item} />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}
