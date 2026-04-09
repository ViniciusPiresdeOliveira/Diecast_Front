import { ImageNotFound } from "@/app/components/ImageNotFound";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatImage } from "../../utils";
import { CardProps } from "./types";

export const Card = ({ mini, handleSelectedMini }: CardProps) => {
  const stylesMiniWithCar = "relative";
  const stylesMiniWithoutCar = "flex items-center justify-center";
  const router = useRouter();

  const handleNavigateToMiniById = () => {
    router.push(`/mini/${mini.id}`);
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
      h-[195px]
      "
    >
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
              e.stopPropagation(); // Evita navegar para a página se clicar na foto para ampliar
              handleSelectedMini(mini);
            }}
          />
        ) : (
          <ImageNotFound />
        )}
      </div>

      <button
        onClick={handleNavigateToMiniById}
        className="relative w-full h-full p-2"
      >
        <div className="flex-1 min-w-0 flex flex-col gap-1 h-full justify-evenly items-start cursor-pointer text-left ">
          <p className="font-medium text-zinc-600 break-words line-clamp-2">
            <span className="text-zinc-800 font-bold">Nome:</span>{" "}
            <span className="font-medium text-zinc-600">{mini.nome}</span>
          </p>

          <p className="flex gap-1 text-lg w-full">
            <span className="text-zinc-800 font-bold">Ano:</span>
            <span className="text-zinc-600 font-medium">{mini.ano}</span>
          </p>

          <p className="text-lg text-blue-700 font-bold">
            R$ {mini?.valor?.toFixed(2) ?? "0.00"}
          </p>
        </div>
      </button>
    </div>
  );
};
