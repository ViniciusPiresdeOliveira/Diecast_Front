import { Miniatura } from "@/app/(home)/types";
import {
  formatImage,
  handleDownloadCatalog,
  handleRedirectToWhatsApp,
  PAGE_INITIAL,
  PaginationDefault,
} from "@/app/(home)/utils";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe("app/(home)/utils", () => {
  describe("formatImage", () => {
    it("retorna undefined quando a imagem não é informada", () => {
      expect(formatImage(undefined)).toBeUndefined();
      expect(formatImage("")).toBeUndefined();
    });

    it("retorna a própria string quando já começa com data:", () => {
      const img = "data:image/png;base64,abc123";
      expect(formatImage(img)).toBe(img);
    });

    it("adiciona o prefixo base64 quando necessário", () => {
      expect(formatImage("abc123")).toBe("data:image/jpeg;base64,abc123");
    });
  });

  describe("PaginationDefault e PAGE_INITIAL", () => {
    it("possui os valores padrão de paginação esperados", () => {
      expect(PaginationDefault).toEqual({
        totalPages: 0,
        totalElements: 0,
        elementsPerPage: 30,
        pageSize: 1,
      });
    });

    it("PAGE_INITIAL é 0", () => {
      expect(PAGE_INITIAL).toBe(0);
    });
  });

  describe("handleRedirectToWhatsApp", () => {
    const originalOpen = window.open;
    const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

    beforeEach(() => {
      window.open = jest.fn();
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "5511999999999";
    });

    afterAll(() => {
      window.open = originalOpen;
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
    });

    it("abre o whatsapp com a mensagem contendo os dados da miniatura", () => {
      const mini = {
        nome: "Ferrari F40",
        ano: 1990,
        marca: { id: 1, nome: "Hot Wheels" },
      } as Miniatura;

      handleRedirectToWhatsApp(mini, "https://site.com/mini/1", false);

      expect(window.open).toHaveBeenCalledTimes(1);
      const [url] = (window.open as jest.Mock).mock.calls[0];
      expect(url).toContain("https://wa.me/5511999999999?text=");
      expect(decodeURIComponent(url)).toContain(
        "Olá, tenho interesse na miniatura Ferrari F40 1990, da Hot Wheels - https://site.com/mini/1",
      );
    });
  });

  describe("handleDownloadCatalog", () => {
    it("dispara um toast de sucesso", () => {
      handleDownloadCatalog();
      expect(toast.success).toHaveBeenCalledWith(
        "Download do catálogo iniciado 🚀",
      );
    });
  });
});
