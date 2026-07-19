import { ImageNotFound } from "@/app/components/ImageNotFound";
import { useAuth } from "@/app/hooks/useAuth";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { formatCurrencyBRL } from "@/app/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatImage } from "../../utils";
import { MiniActions } from "../MiniActions";
import { CardProps } from "./types";

export const Card = ({
  mini,
  handleSelectedMini,
  handleVisibleFormMini,
  handleDeleteMiniById,
}: CardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { isMobile } = useTypeDevice();

  const stylesMiniWithCar = "relative";
  const stylesMiniWithoutCar = "flex items-center justify-center";

  const handleNavigateToMiniById = () => {
    router.push(`/mini/${mini.id}`);
  };

  return (
    <div
      className={`
  bg-zinc-100 text-zinc-100
  px-2 rounded-xl
  w-full 
  flex items-center
  border ${mini.quantidadeDisponivel === 0 ? "border-red-primary" : "border-blue-300"}
  transition-all duration-300 ease-out
  hover:-translate-y-1
  hover:bg-gray-200
  hover:shadow-md ${mini.quantidadeDisponivel === 0 ? "hover:shadow-red-primary/30" : "hover:shadow-blue-primary/30"}
  ${mini.quantidadeDisponivel === 0 ? "hover:border-red-primary" : "hover:border-blue-primary"}
  h-[195px] relative group
  `}
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
        <MiniActions
          mini={mini}
          handleSelectedMini={handleSelectedMini}
          handleVisibleFormMini={handleVisibleFormMini}
          handleDeleteMiniById={handleDeleteMiniById}
          variant="card"
          isMobile={isMobile}
        />
      )}
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
