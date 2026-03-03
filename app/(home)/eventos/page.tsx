"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";

type Evento = {
  id: number;
  titulo: string;
  data: string;
  descricao: string;
  imagens: string[];
};

const eventos: Evento[] = [
  {
    id: 1,
    titulo: "Encontro de Colecionadores 2025",
    data: "15 de Março de 2025",
    descricao:
      "Um grande encontro reunindo colecionadores apaixonados por miniaturas diecast. Tivemos exposição de modelos raros, troca de peças e muita interação entre os participantes.",
    imagens: ["/image/car.jpeg", "/image/car.jpeg", "/image/car.jpeg"],
  },
  {
    id: 2,
    titulo: "Exposição Diecast Petrópolis",
    data: "02 de Fevereiro de 2025",
    descricao:
      "Evento especial realizado em Petrópolis com destaque para lançamentos exclusivos e modelos históricos. Um momento único para os fãs do universo automotivo em miniatura.",
    imagens: ["/image/car.jpeg", "/image/car.jpeg"],
  },
];

export default function Eventos() {
  return (
    <div className="w-full min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-14">Nossos Eventos</h1>

        <div className="flex flex-col gap-16">
          {eventos.map((evento) => (
            <div key={evento.id} className="bg-white rounded-3xl shadow-lg p-8">
              {/* Header */}
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-semibold mb-2">{evento.titulo}</h2>
                <p className="text-gray-500">{evento.data}</p>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                {evento.descricao}
              </p>

              <Splide
                options={{
                  type: "loop",
                  perPage: 1,
                  autoplay: true,
                  pauseOnHover: true,
                  arrows: true,
                  pagination: true,
                }}
              >
                {evento.imagens.map((img, index) => (
                  <SplideSlide key={index}>
                    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                      <Image
                        src={img}
                        alt={`Imagem ${index + 1} do ${evento.titulo}`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
