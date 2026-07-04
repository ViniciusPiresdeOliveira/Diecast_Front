import { toast } from "react-toastify";
import { Miniatura, PaginationInfo } from "./types";

export const formatImage = (img?: string) => {
  if (!img) return undefined;

  return img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`;
};

export const PaginationDefault: PaginationInfo = {
  totalPages: 0,
  totalElements: 0,
  elementsPerPage: 30,
  pageSize: 1,
};

export const PAGE_INITIAL = 0;

export const handleRedirectToWhatsApp = (
  mini: Miniatura,
  link: string,
  isMobile: boolean,
) => {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  // tirar quando o icone de whatsapp só tiver para cliente
  // handleVisibleFormMini();
  //

  const message = `Olá, tenho interesse na miniatura ${mini.nome} ${mini.ano}, da ${mini.marca.nome} - ${link}`;
  const encodedMessage = encodeURIComponent(message);

  // if (isMobile) {
  //   const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodedMessage}`;
  //   window.location.href = url;
  // } else {
  window.open(`https://wa.me/${number}?text=${encodedMessage}`, "_blank");
  // }
};

export const handleDownloadCatalog = () => {
  toast.success("Download do catálogo iniciado 🚀");
};
