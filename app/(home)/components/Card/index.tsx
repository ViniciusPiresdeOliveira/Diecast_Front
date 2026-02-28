import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CardProps } from "./types";

export const Card = ({ mini, handleSelectedMini }: CardProps) => {
  const stylesMiniWithCar = "relative";
  const stylesMiniWithoutCar = "flex items-center justify-center";
  const router = useRouter();

  // const [visibleModalFormMini, setVisibleModalFormMini] = useState(false);

  // const handleVisibleFormMini = () => {
  //   setVisibleModalFormMini((e) => !e);
  // };

  const handleNavigateToMiniById = () => {
    router.push(`/mini/${mini.id}`);
  };

  const link = globalThis.location.href;

  return (
    <>
      <button
        className="
      group bg-zinc-100 text-zinc-100
      px-1 rounded-xl
      w-full lg:w-[47%] xl:w-[30%]
      flex items-center
      border border-blue-300
      transition-all duration-300 ease-out
      hover:-translate-y-1
      hover:bg-gray-200
      hover:shadow-md hover:shadow-black/30
      hover:border-blue-700
      shrink-0
      min-h-[195px]
      "
      >
        <div
          className={
            "w-40 h-40 shrink-0 rounded-md overflow-hidden z-10 " +
            (mini.image ? stylesMiniWithCar : stylesMiniWithoutCar)
          }
        >
          {mini.image ? (
            <Image
              src={mini.image}
              alt={mini.name}
              fill
              className="object-contain cursor-pointer z-10 transition-transform duration-300 group-hover:scale-110"
              onClick={() => {
                handleSelectedMini(mini);
              }}
            />
          ) : (
            <ImageOff className="w-12 h-12 text-blue-300 group-hover:text-blue-700 transition-colors" />
          )}
        </div>
        <button
          // onClick={handleVisibleFormMini} somente para admin
          onClick={handleNavigateToMiniById}
          className="relative w-full h-full"
        >
          <div className="flex-1 min-w-0 flex flex-col gap-0 h-full justify-evenly items-start cursor-pointer text-left ">
            <p className="font-medium text-zinc-600 break-words">
              <span className="text-zinc-800 font-bold">Nome:</span>{" "}
              <span className="font-medium text-zinc-600">{mini.name}</span>
            </p>

            <p className="grid grid-cols-[45px_1fr] text-lg w-full">
              <span className="text-zinc-800 font-bold">Ano:</span>
              <span className="text-zinc-600 font-medium">{mini.ano}</span>
            </p>

            <p className="text-lg text-blue-700 font-bold">
              R$ {mini.preco.toFixed(2)}
            </p>
          </div>
          {/* <button
            className="absolute p-5 -right-2 -bottom-1
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
          </button> */}
        </button>
      </button>
      {/* <ModalFormMini
        type="edit"
        visible={visibleModalFormMini}
        mini={mini}
        handleVisibleFormMini={handleVisibleFormMini}
      /> */}
    </>
  );
};
