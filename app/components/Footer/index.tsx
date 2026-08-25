import Image from "next/image";
import { useRouter } from "next/navigation";
export const Footer = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full gap-2 p-5 text-center flex flex-col justify-center items-center bg-blue-primary border-t-red-primary border-t-3">
      <p className="text-white font-semibold">
        📍Possuímos loja física - R. Dr. Nelson de Sa Earp, 95 - Centro Sala
        323, Petrópolis, Rio de Janeiro, Brazil 25010-160
      </p>
      <a
        href="https://chat.whatsapp.com/B88velEqWatGGzb1xKccXk?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnihHRLlq75YwxWlBtZ8X_CvvOrhkHIKQXr4bnrKJJABiMhm2F7ZNoA_OJZB4_aem_1-p1UnOayO0MVaWbtn5VsQ"
        target="_blank"
        aria-label="Faça parte de nosso grupo exclusivo, onde postamos miniaturas em primeira mão"
        rel="noopener noreferrer"
        className="text-white font-semibold flex gap-2 items-center hover:opacity-80 transition"
      >
        <Image
          color="#eefr"
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={18}
          height={18}
        />
        Faça parte do grupo exclusivo e veja novos álbuns toda semana!
      </a>

      <a
        href="https://www.youtube.com/@rkmdiecast"
        target="_blank"
        aria-label="Abrir canal no YouTube"
        rel="noopener noreferrer"
        className="text-white font-semibold flex gap-2 items-center hover:opacity-80 transition"
      >
        <Image
          color="#eefr"
          src="/youtube.svg"
          alt="WhatsApp"
          width={18}
          height={18}
        />
        Inscreva-se no nosso canal
      </a>
      <a
        href="https://www.instagram.com/petropolisdiecast/"
        target="_blank"
        aria-label="Abrir Instagram da loja"
        rel="noopener noreferrer"
        className="text-white font-semibold flex gap-2 items-center hover:opacity-80 transition"
      >
        <Image
          color="#eefr"
          src="/instagram.svg"
          alt="WhatsApp"
          width={18}
          height={18}
        />
        Siga-nos no Instagram
      </a>
      <p className="text-white font-semibold">💰 Compramos coleções</p>
    </div>
  );
};
