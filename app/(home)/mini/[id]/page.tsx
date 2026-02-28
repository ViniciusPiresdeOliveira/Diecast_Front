"use client";
import { Carousel, Image as ImageANTD } from "antd";
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

  const link = globalThis.location.href;

  return (
    <div className="p-8">
      <div className="flex justify-center gap-8">
        <div className="w-full max-w-[500px]">
          <ImageANTD
            src={mini.image}
            alt={mini.name}
            rootClassName="custom-image"
            style={{ width: "100%", height: "auto" }}
            className="object-contain cursor-pointer z-10 transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-4">
            {mini.marca} {mini.name} - {mini.ano}
          </h1>

          <p className="text-4xl font-bold">R${mini.preco}</p>
          <button
            className="
          z-20 cursor-pointer
                      transition-transform duration-200 ease-in-out
                      hover:scale-115"
            onClick={() => handleRedirectToWhatsApp(mini, link)}
          >
            <Image
              color="#eefr"
              src="/whatsapp.svg"
              alt="WhatsApp"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
      <div className="mt-16 md:w-[60%] md:ml-[20%] -md:w-[85%]">
        <h2 className="text-2xl font-bold mb-6 text-center">Outras minis</h2>

        <Carousel
          autoplay
          centerMode
          // slidesToShow={3}
          arrows
          responsive={[
            {
              breakpoint: 5000, // abaixo de 1024px
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 1560, // abaixo de 1024px
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 550, // abaixo de 768px
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
        >
          {minis
            .filter((item) => item.id !== mini.id)
            .map((item) => (
              <div key={item.id} className="px-3 pb-8">
                <div className="rounded-xl w-[174px] h-[402px] shadow-md p-4 flex flex-col items-center gap-3 transition-all duration-300 border border-blue-300 hover:border-blue-700">
                  <ImageANTD
                    src={item.image}
                    alt={item.name}
                    preview={false}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
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
              </div>
            ))}
        </Carousel>
      </div>
    </div>
  );
}
