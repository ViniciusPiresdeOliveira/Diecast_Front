import { InstagramIcon } from "lucide-react";
import { useRouter } from "next/navigation";
export const Footer = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full gap-2 p-5 text-center flex flex-col justify-center items-center bg-blue-primary border-t-red-primary border-t-3">
      <p className="text-white font-semibold">
        📍Possuímos loja física - R. Dr. Nelson de Sa Earp, 95 - Centro Sala
        323, Petrópolis, Rio de Janeiro, Brazil 25010-160
      </p>
      <p className="text-white font-semibold">💰 Compramos coleções</p>
      <a
        href="https://www.instagram.com/petropolisdiecast/"
        target="_blank"
        aria-label="Abrir Instagram da loja"
        rel="noopener noreferrer"
        className="text-white font-semibold flex gap-2 items-center hover:opacity-80 transition"
      >
        <InstagramIcon size={18} />
        Siga-nos no Instagram
      </a>
    </div>
  );
};
