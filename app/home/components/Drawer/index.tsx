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
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleVisibility}
      />

      {/* Sidebar */}
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
        <button
          className="absolute top-4 right-4 text-2xl hover:text-red-400 cursor-pointer"
          onClick={handleVisibility}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-6">Menu</h2>

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
