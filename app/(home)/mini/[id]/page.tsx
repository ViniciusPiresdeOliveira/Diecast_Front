"use client";
import { ImageNotFound } from "@/app/components/ImageNotFound";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Image as ImageANTD } from "antd";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { Miniatura } from "../../types";
import { handleRedirectToWhatsApp, minis } from "../../utils";

export default function MiniDetail() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const mini = minis.find((item: Miniatura) => item.id === id);

  if (!mini) {
    notFound();
  }

  // const link = globalThis.location.href;

  return (
    <div className="p-8">
      <div className="flex justify-center gap-8">
        <div className="w-[80%] max-w-[400px]">
          <ImageANTD
            src={mini.image}
            alt={mini.name}
            rootClassName="custom-image"
            style={{ width: "100%", height: "auto" }}
            className="object-contain cursor-pointer z-10 transition-transform duration-300 group-hover:scale-110"
          />
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
              onClick={() => handleRedirectToWhatsApp(mini, "link")}
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

        <Splide
          options={{
            type: "loop",
            perPage: 4,
            perMove: 1,
            gap: "20px",
            arrows: true,
            pagination: true,
            autoplay: true,
            interval: 2500,
            speed: 850,
            breakpoints: {
              1024: {
                perPage: 3,
              },
              640: {
                perPage: 2,
              },
              435: {
                perPage: 1,
              },
            },
          }}
        >
          {minis
            .filter((item) => item.id !== mini.id)
            .map((item) => (
              <SplideSlide key={item.id}>
                <div className="mb-9 rounded-xl w-[175px] h-[400px] shadow-md p-4 flex flex-col items-center gap-3 transition-all duration-300 border border-blue-300 hover:border-blue-700 mx-auto">
                  {item.image ? (
                    <ImageANTD
                      src={item.image}
                      alt={item.name}
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
                      {item.marca} {item.name}
                    </h3>

                    <p className="font-bold text-lg">R$ {item.preco}</p>

                    <button
                      onClick={() => router.push(`/mini/${item.id}`)}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                    >
                      Detalhe
                    </button>
                  </div>
                </div>
              </SplideSlide>
            ))}
        </Splide>
      </div>
    </div>
  );
}
