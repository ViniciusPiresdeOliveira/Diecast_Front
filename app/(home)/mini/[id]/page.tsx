"use client";
import { getMiniById, getSimilarMiniaturesById } from "@/app/api/miniatura";
import { ImageNotFound } from "@/app/components/ImageNotFound";
import { useCurrentUrl } from "@/app/hooks/useCurrentUrl";
import { useLoading } from "@/app/hooks/useLoading";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { formatCurrencyBRL } from "@/app/utils";
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
import { formatListPTBR, optionsCarousel } from "./utils";

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
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10 bg-white rounded-2xl shadow-sm border border-[var(--color-gray-200)] p-6">
        {/* Bloco da Imagem */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 ">
          <div className="w-full max-w-[400px]">
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
        </div>

        {/* Detalhes do Produto */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-blue-primary)] mb-4">
              {mini?.nome}
            </h1>

            <div className="divide-y divide-[var(--color-gray-200)] text-sm">
              <div className="py-2 flex justify-between">
                <span className="font-semibold text-gray-500">Marca</span>
                <span className="font-bold text-gray-800">
                  {mini?.marca?.nome}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="font-semibold text-gray-500">Ano</span>
                <span className="font-bold text-gray-800">{mini?.ano}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="font-semibold text-gray-500">Escala</span>
                <span className="font-bold text-gray-800">
                  {mini?.escala?.nome}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="font-semibold text-gray-500">Condição</span>
                <span className="font-bold text-gray-800">
                  {mini?.condicao?.nome}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="font-semibold text-gray-500">Linha</span>
                <span className="font-bold text-gray-800">
                  {mini?.linha?.nome}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="font-semibold text-gray-500">
                  {(mini?.tipos?.length ?? 0) > 1 ? "Tipos" : "Tipo"}
                </span>
                <span className="font-bold text-gray-800">
                  {formatListPTBR(mini?.tipos)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--color-gray-200)]">
            <p className="text-4xl font-extrabold text-[var(--color-red-primary)] mb-3">
              {formatCurrencyBRL(mini?.valor)}
            </p>

            <p className="text-xs text-gray-500 mb-4">
              Interessado nesta miniatura? Entre em contato pelo WhatsApp e
              garanta sua reserva!
            </p>

            {mini && (
              <button
                className="cursor-pointer w-full text-gray-500 font-semibold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-md"
                onClick={() => handleRedirectToWhatsApp(mini, link, isMobile)}
              >
                <Image
                  src="/whatsapp.svg"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                />
                Comprar pelo WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carrossel */}
      <div className="mt-14 w-full">
        <h2 className="text-2xl font-bold text-[var(--color-blue-primary)] mb-6 text-center">
          Outras minis
        </h2>
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
