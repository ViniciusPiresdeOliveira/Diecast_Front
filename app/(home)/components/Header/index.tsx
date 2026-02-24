import { Menu } from "lucide-react";
import Image from "next/image";
import { HeaderProps } from "./types";
export const Header = ({ handleVisibilityMenu }: HeaderProps) => {
  return (
    <div className="w-full h-full p-5 flex justify-between items-center bg-blue-primary border-b-red-primary border-b-3">
      <div className="flex items-center gap-2 pl-2 ">
        <Image
          src="/image/logo.jpg"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full object-contain"
        />
        <p className="text-white font-semibold">Diecast</p>
      </div>
      <button
        className="p-2 cursor-pointer min-sm:hidden"
        onClick={handleVisibilityMenu}
      >
        <Menu color="white" />
      </button>
    </div>
  );
};
