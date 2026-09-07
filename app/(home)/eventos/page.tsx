"use client";

import { deleteEventById, getAllEvents } from "@/app/api/evento";
import { DeleteButton } from "@/app/components/Buttons/Delete";
import { EditButton } from "@/app/components/Buttons/Edit";
import { DeleteConfirmModal } from "@/app/components/Modal/Delete";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { formatSimpleDate, getErrorMessage } from "@/app/utils";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Image } from "antd";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatImage } from "../utils";
import { ModalFormEvento } from "./components/ModalFormEvento";
import { TypeOfModalAction } from "./components/ModalFormEvento/types";
import { Evento } from "./types";

export default function Eventos() {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [visibleModalFormEvento, setVisibleModalFormEvento] = useState(false);
  const [typeOfModalActionEvento, setTypeOfModalActionEvento] =
    useState<TypeOfModalAction>("add");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState<Evento | null>(null);

  const handleVisibleFormEvento = (type: TypeOfModalAction) => {
    setTypeOfModalActionEvento(type);
    setVisibleModalFormEvento((e) => !e);
  };

  const handleSelectedEvento = (evento: Evento | null) => {
    setSelectedEvento(evento);
  };

  const fetchEventos = async () => {
    showLoading();
    try {
      const { data } = await getAllEvents();
      setEventos(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const handleOpenDeleteModal = (evento: Evento) => {
    setEventoToDelete(evento);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventoToDelete(null);
  };

  const handleDeleteEvento = async () => {
    if (!eventoToDelete) return;

    showLoading();
    try {
      await deleteEventById(eventoToDelete.id);
      toast.success(`Evento "${eventoToDelete.titulo}" apagado com sucesso`);
      await fetchEventos();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (!visibleModalFormEvento) {
      setTypeOfModalActionEvento("add");
      setSelectedEvento(null);
    }
  }, [visibleModalFormEvento]);

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <div className="w-full min-h-screen py-12 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center relative mb-14">
          <h1 className="text-4xl font-bold text-center">
            Conheça nossos Eventos
          </h1>

          {user?.role === "ADMIN" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer">
              <CirclePlus
                color="#1f3565"
                width={36}
                height={36}
                className="hover:scale-110 transition-all duration-300 ease-out"
                onClick={() => handleVisibleFormEvento("add")}
              />
            </div>
          )}
        </div>

        {eventos.length === 0 && (
          <div className="w-full flex items-center justify-center mb-24">
            <div className="flex flex-col items-center text-center">
              <span className="text-5xl mb-4">📅</span>
              <p className="text-2xl font-semibold text-gray-700">
                Nenhum evento cadastrado
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-16">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-3xl shadow-lg p-8 relative"
            >
              {user?.role === "ADMIN" && (
                <div className="absolute top-6 right-6 flex items-center gap-1.5 z-10">
                  <EditButton
                    onClick={() => {
                      handleSelectedEvento(evento);
                      handleVisibleFormEvento("edit");
                    }}
                    variant="table"
                  />
                  <DeleteButton
                    onClick={() => handleOpenDeleteModal(evento)}
                    variant="table"
                  />
                </div>
              )}

              <div className="mb-6 text-center">
                <h2 className="text-3xl font-semibold mb-2">{evento.titulo}</h2>
                <p className="text-gray-500">
                  {formatSimpleDate(evento.dataEvento)}
                </p>
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
                {evento.imagens.map((i) => (
                  <SplideSlide key={i.id}>
                    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                      <Image
                        src={formatImage(i.imagem) as string}
                        alt={`Imagem ${i.id} do ${evento.titulo}`}
                        className="object-contain cursor-pointer z-10 transition-transform duration-300 hover:scale-110"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            </div>
          ))}
        </div>
      </div>

      <ModalFormEvento
        type={typeOfModalActionEvento}
        evento={selectedEvento}
        visible={visibleModalFormEvento}
        handleVisibleFormEvento={handleVisibleFormEvento}
        refreshEventoList={fetchEventos}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        title="Excluir evento"
        confirmText="Excluir"
        onConfirm={handleDeleteEvento}
        onCancel={handleCloseDeleteModal}
        message="Tem certeza que deseja excluir "
        nameSpecific={eventoToDelete?.titulo}
      />
    </div>
  );
}
