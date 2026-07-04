import { deleteMiniById } from "@/app/api/miniatura";
import { ImageNotFound } from "@/app/components/ImageNotFound";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { formatCurrencyBRL, getErrorMessage } from "@/app/utils";
import { Popconfirm } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { formatImage } from "../../utils";
import { CardProps } from "./types";

export const Card = ({
  mini,
  handleSelectedMini,
  handleVisibleFormMini,
  refreshMiniList,
}: CardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { isMobile } = useTypeDevice();
  const { hideLoading, showLoading } = useLoading();

  const stylesMiniWithCar = "relative";
  const stylesMiniWithoutCar = "flex items-center justify-center";

  const handleNavigateToMiniById = () => {
    router.push(`/mini/${mini.id}`);
  };

  const handleDeleteMiniById = async () => {
    showLoading();
    try {
      await deleteMiniById(mini.id);
      refreshMiniList();
      toast.success(`${mini.nome} apagada com sucesso`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  return (
    <div
      className="
      bg-zinc-100 text-zinc-100
      px-2 rounded-xl
      w-full 
      flex items-center
      border border-blue-300
      transition-all duration-300 ease-out
      hover:-translate-y-1
      hover:bg-gray-200
      hover:shadow-md hover:shadow-black/30
      hover:border-blue-700
      h-[195px] relative group
      "
    >
      {/* IMAGEM */}
      <div
        className={
          "w-40 h-40 shrink-0 rounded-md overflow-hidden z-10 " +
          (mini.imagem ? stylesMiniWithCar : stylesMiniWithoutCar)
        }
      >
        {mini.imagem ? (
          <Image
            src={formatImage(mini.imagem)!}
            alt={mini.nome}
            fill
            className="object-contain cursor-pointer z-10 transition-transform duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectedMini(mini);
            }}
          />
        ) : (
          <ImageNotFound />
        )}
      </div>

      {/* BOTÕES (APARECEM NO HOVER) */}
      {user?.role === "ADMIN" && (
        <>
          {/* EDITAR */}
          <button
            onClick={() => {
              handleSelectedMini(mini);
              handleVisibleFormMini("edit");
            }}
            className={
              "z-10 cursor-pointer w-8 h-8 absolute right-2 bottom-24 " +
              "flex items-center justify-center " +
              "transition-all duration-300 hover:scale-110 " +
              (isMobile
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0")
            }
          >
            <Pencil size={24} color="#07ac5a" />
          </button>

          {/* EXCLUIR */}
          <button
            className={
              "z-10 cursor-pointer w-8 h-8 absolute right-2 bottom-15 " +
              "flex items-center justify-center rounded-full " +
              "transition-all duration-300 hover:scale-110 " +
              (isMobile
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0")
            }
          >
            <Popconfirm
              title="Deseja excluir?"
              onConfirm={handleDeleteMiniById}
              okText="Sim"
              cancelText="Não"
            >
              <Trash2 size={24} color="#f31a13" />
            </Popconfirm>
          </button>
        </>
      )}

      {/* CONTEÚDO */}
      <button
        onClick={handleNavigateToMiniById}
        className="relative w-full h-full p-2"
      >
        <div className="flex-1 min-w-0 flex flex-col gap-1 h-full justify-evenly items-start cursor-pointer text-left">
          <p className="font-medium text-zinc-600 break-words line-clamp-2">
            <span className="text-zinc-800 font-bold">Nome:</span>{" "}
            <span className="font-medium text-zinc-600">{mini.nome}</span>
          </p>

          <p className="flex gap-1 text-lg w-full">
            <span className="text-zinc-800 font-bold">Ano:</span>
            <span className="text-zinc-600 font-medium">{mini.ano}</span>
          </p>

          <p className="text-lg text-blue-700 font-bold">
            {formatCurrencyBRL(mini.valor)}
          </p>
        </div>
      </button>
    </div>
  );
};
