"use client";
import {
  deleteMiniById,
  getMiniById,
  getSimilarMiniaturesById,
  putAvailableQuantityMini,
} from "@/app/api/miniatura";
import { ImageNotFound } from "@/app/components/ImageNotFound";
import { useAuth } from "@/app/hooks/useAuth";
import { useCurrentUrl } from "@/app/hooks/useCurrentUrl";
import { useLoading } from "@/app/hooks/useLoading";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { formatCurrencyBRL, getErrorMessage } from "@/app/utils";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Image as ImageANTD, Tooltip } from "antd";
import { HelpCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MiniActions } from "../../components/MiniActions";
import { ModalFormMini } from "../../components/ModalFormMini";
import { TypeOfModalAction } from "../../components/ModalFormMini/types";
import { Miniatura } from "../../types";
import { formatImage, handleRedirectToWhatsApp } from "../../utils";
import { MiniCard } from "./components/CardCarousel";
import { formatListPTBR, optionsCarousel } from "./utils";

export default function MiniDetail() {
  const params = useParams();
  const link = useCurrentUrl();
  const { isMobile } = useTypeDevice();
  const { hideLoading, showLoading } = useLoading();
  const { user } = useAuth();

  const [mini, setMini] = useState<Miniatura>();
  const [similiarMinis, setSimiliarMinis] = useState<Miniatura[]>([]);

  // ---- Estado replicado da Home para edição/exclusão ----
  const [selectedMini, setSelectedMini] = useState<Miniatura | null>(null);
  const [visibleModalFormMini, setVisibleModalFormMini] = useState(false);
  const [typeOfModalAction, setTypeOfModalAction] =
    useState<TypeOfModalAction>("add");

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

  const handleSelectedMini = (mini: Miniatura | null) => {
    setSelectedMini(mini);
  };

  const handleVisibleFormMini = (type: TypeOfModalAction) => {
    setTypeOfModalAction(type);
    setVisibleModalFormMini((e) => !e);
  };

  const handleDeleteMiniById = async (
    miniToDelete: Miniatura,
    quantidade?: number,
  ): Promise<boolean> => {
    const temMaisDeUmaUnidade = (miniToDelete.quantidadeEstoque ?? 0) > 1;

    showLoading();
    try {
      if (temMaisDeUmaUnidade) {
        await putAvailableQuantityMini(miniToDelete.id, quantidade as number);
        toast.success(
          `${miniToDelete.nome} com quantidade deduzida com sucesso`,
        );
      } else {
        await deleteMiniById(miniToDelete.id);
        toast.success(`${miniToDelete.nome} apagada com sucesso`);
      }
      refreshMini();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      hideLoading();
    }
  };

  // Na Home, "refreshMiniList" recarrega a lista paginada.
  // Aqui, como é uma tela de detalhe, basta re-buscar os dados dessa miniatura.
  const refreshMini = () => {
    fetchData();
  };

  useEffect(() => {
    if (visibleModalFormMini === false) {
      setTypeOfModalAction("add");
      handleSelectedMini(null);
    }
  }, [visibleModalFormMini]);

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12">
      {/* Card Principal */}
      <div className=" rounded-3xl border border-[var(--color-gray-200)] shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Bloco da Imagem */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center relative group min-h-[350px]">
          <div className="w-full max-w-[380px] flex items-center justify-center">
            {mini?.imagem ? (
              <ImageANTD
                src={formatImage(mini.imagem)}
                alt={mini.nome}
                rootClassName="custom-image"
                style={{ width: "100%", height: "auto" }}
                className="object-contain cursor-pointer z-10 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center transition-colors">
                <ImageNotFound className="object-contain cursor-pointer z-10 transition-transform duration-300 group-hover:scale-105" />
              </div>
            )}
          </div>
        </div>

        {/* Detalhes do Produto */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Título e Tags Rápidas */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-blue-primary)] tracking-tight">
                {mini?.nome}
              </h1>

              <div className="flex items-center gap-1.5 ml-1">
                {/* Ícone de ajuda - sistema de garagem */}
                <Tooltip
                  title="O sistema de garagem permite reservar a miniatura por até 90 dias. Assim, você pode colocar várias miniaturas no mesmo envio, tendo um aproveitamento melhor do frete. O pagamento via Pix deverá ser feito em até 48h para a reserva ser efetivada. Após 90 dias, se o envio não for solicitado, a miniatura volta ao estoque."
                  placement="top"
                >
                  <HelpCircle className="w-5 h-5 text-gray-400 hover:text-[var(--color-blue-primary)] cursor-help transition-colors" />
                </Tooltip>

                {/* Botões de editar/excluir - mesma lógica da Home */}
                {mini && user && (
                  <MiniActions
                    mini={mini}
                    handleSelectedMini={handleSelectedMini}
                    handleVisibleFormMini={handleVisibleFormMini}
                    handleDeleteMiniById={handleDeleteMiniById}
                    refreshList={refreshMini}
                    variant="detail"
                  />
                )}
              </div>
            </div>

            {/* Grid de Especificações */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-gray-200)]">
                <span className="block text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Marca
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {mini?.marca?.nome}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-gray-200)]">
                <span className="block text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Ano
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {mini?.ano}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-gray-200)]">
                <span className="block text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Escala
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {mini?.escala?.nome}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-gray-200)]">
                <span className="block text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Condição
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {mini?.condicao?.nome}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-gray-200)]">
                <span className="block text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Linha
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {mini?.linha?.nome}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-gray-200)]">
                <span className="block text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {(mini?.tipos?.length ?? 0) > 1 ? "Tipos" : "Tipo"}
                </span>
                <span
                  className="font-bold text-gray-800 text-sm truncate block"
                  title={formatListPTBR(mini?.tipos)}
                >
                  {formatListPTBR(mini?.tipos)}
                </span>
              </div>
            </div>
          </div>

          {/* Preço e Botão de Ação */}
          <div className="pt-4 border-t border-[var(--color-gray-200)]">
            <div className="mb-4">
              <span className="text-xs text-gray-400 block font-medium">
                Valor
              </span>
              <p className="text-4xl font-black text-[var(--color-red-primary)] tracking-tight">
                {formatCurrencyBRL(mini?.valor)}
              </p>
            </div>

            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Interessado nesta miniatura? Entre em contato pelo WhatsApp e
              garanta sua reserva!
            </p>

            {mini && (
              <button
                className="cursor-pointer w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-md active:scale-95"
                onClick={() => handleRedirectToWhatsApp(mini, link, isMobile)}
              >
                <Image
                  src="/whatsapp.svg"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
                Comprar pelo WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-blue-primary)] whitespace-nowrap">
            Outras minis
          </h2>
          <div className="h-[1px] w-full bg-[var(--color-gray-200)]"></div>
        </div>

        <Splide key={similiarMinis.length} options={optionsCarousel}>
          {similiarMinis.map((item) => (
            <SplideSlide key={item.id}>
              <MiniCard mini={item} />
            </SplideSlide>
          ))}
        </Splide>
      </div>

      {/* Modal de edição - mesma lógica da Home */}
      <ModalFormMini
        type={typeOfModalAction}
        mini={selectedMini}
        visible={visibleModalFormMini}
        handleVisibleFormMini={handleVisibleFormMini}
        refreshMiniList={refreshMini}
      />
    </div>
  );
}
