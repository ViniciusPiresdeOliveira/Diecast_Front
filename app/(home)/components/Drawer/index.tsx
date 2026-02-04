import { X } from "lucide-react";
import { DrawerProps } from "./types";

export const Drawer = ({ isVisible, handleVisibility }: DrawerProps) => {
  return (
    <div
      className={`
    fixed inset-0 z-50
    transition-opacity duration-300 ease-out
    ${
      isVisible
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleVisibility}
      />

      <aside
        className={`
      absolute right-0 top-0
      h-full w-72
      bg-[#1F3565]
      text-white
      p-6
      shadow-xl
      transform transition-transform duration-300 ease-out
      ${isVisible ? "translate-x-0" : "translate-x-full"}
    `}
      >
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-lg font-bold ">Menu</h2>
          <button
            className=" hover:text-red-400 cursor-pointer"
            onClick={handleVisibility}
          >
            <X width={30} height={30} />
          </button>
        </div>

        <ul className="flex flex-col gap-4">
          <li className="cursor-pointer hover:text-blue-300">Início</li>
          <li className="cursor-pointer hover:text-blue-300">Miniaturas</li>
          <li className="cursor-pointer hover:text-blue-300">Favoritos</li>
          <li className="cursor-pointer hover:text-blue-300">Configurações</li>
        </ul>
      </aside>
    </div>
  );
};
