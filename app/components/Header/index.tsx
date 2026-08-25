import { fetchLogout } from "@/app/api/logout";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeaderProps } from "./types";
export const Header = ({ handleVisibilityMenu }: HeaderProps) => {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const { user, handleClearUser } = useAuth();

  const handleNavigateToHome = () => {
    router.push(`/`);
  };

  const handleLogout = async () => {
    try {
      showLoading();
      await fetchLogout();
    } catch (error) {
      console.log("ff");
    } finally {
      hideLoading();
    }
    handleClearUser();
  };

  return (
    <div className="w-full h-full p-5 flex justify-between items-center bg-blue-primary border-b-red-primary border-b-3">
      <button
        onClick={handleNavigateToHome}
        className="flex items-center gap-2 pl-2 cursor-pointer"
      >
        <Image
          src="/image/logo.jpg"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full object-contain"
        />
        <p className="text-white font-semibold">
          {user?.name ? `Olá, ${user.name}` : "Diecast"}
        </p>
      </button>
      <div className="flex justify-center items-center gap-6">
        {user?.role === "ADMIN" && (
          <div className="hidden min-md:flex gap-6 text-gray-200 font-medium">
            <Link href={"/clientes"}>Clientes</Link>
          </div>
        )}
        <div className="hidden min-md:flex gap-6 text-gray-200 font-medium">
          <Link href={"/afiliado"}>Afiliado</Link>
        </div>
        <div className="hidden min-md:flex gap-6 text-gray-200 font-medium">
          <Link href={"/eventos"}>Eventos</Link>
        </div>
        {user?.role === "ADMIN" && (
          <button
            onClick={handleLogout}
            className="z-10 cursor-pointer w-8 h-8 flex items-center justify-center transition-transform duration-300 hover:scale-110"
          >
            <LogOut size={24} color="white" />
          </button>
        )}
        <button
          className="p-2 cursor-pointer min-md:hidden"
          onClick={handleVisibilityMenu}
        >
          <Menu color="white" />
        </button>
      </div>
    </div>
  );
};
