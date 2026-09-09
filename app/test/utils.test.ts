import axios from "axios";
import {
  cn,
  formatCep,
  formatCurrencyBRL,
  formatDateTimeToPtBR,
  formatSimpleDate,
  formatTelefone,
  getCodError,
  getErrorMessage,
  handleWhatsApp,
  prefixExample,
  toNumberArray,
} from "../utils";

describe("app/utils", () => {
  describe("prefixExample", () => {
    it('deve exportar o prefixo "Ex.: "', () => {
      expect(prefixExample).toBe("Ex.: ");
    });
  });

  describe("getErrorMessage", () => {
    it("retorna mensagem de sessão expirada quando status é 403", () => {
      const error = {
        isAxiosError: true,
        response: { status: 403 },
      };
      jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
      expect(getErrorMessage(error)).toBe(
        "Sessão expirada. Faça login novamente.",
      );
    });

    it("retorna a mensagem vinda do backend quando presente", () => {
      const error = {
        isAxiosError: true,
        response: { status: 400, data: { message: "Campo inválido" } },
      };
      jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
      expect(getErrorMessage(error)).toBe("Campo inválido");
    });

    it('retorna "Erro na requisição" quando axios error não tem mensagem', () => {
      const error = { isAxiosError: true, response: { status: 500 } };
      jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
      expect(getErrorMessage(error)).toBe("Erro na requisição");
    });

    it("retorna a mensagem quando o erro é uma instância de Error", () => {
      jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(false);
      expect(getErrorMessage(new Error("Falha inesperada"))).toBe(
        "Falha inesperada",
      );
    });

    it('retorna "Erro inesperado" para valores desconhecidos', () => {
      jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(false);
      expect(getErrorMessage("qualquer coisa")).toBe("Erro inesperado");
      expect(getErrorMessage(null)).toBe("Erro inesperado");
      expect(getErrorMessage(undefined)).toBe("Erro inesperado");
    });
  });

  describe("getCodError", () => {
    it("retorna o status quando é um erro do axios", () => {
      jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
      const error = { response: { status: 404 } };
      expect(getCodError(error)).toBe(404);
    });

    it('retorna "Erro inesperado" quando é axios error mas sem "error" truthy', () => {
      jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
      expect(getCodError(null)).toBe("Erro inesperado");
    });

    it("retorna undefined quando não é erro do axios", () => {
      jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(false);
      expect(getCodError(new Error("x"))).toBeUndefined();
    });
  });

  describe("formatCurrencyBRL", () => {
    it("formata um número como moeda BRL", () => {
      expect(formatCurrencyBRL(1000)).toBe(
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(1000),
      );
    });

    it("formata uma string numérica como moeda BRL", () => {
      expect(formatCurrencyBRL("50.5")).toBe(
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(50.5),
      );
    });

    it("retorna string vazia para null ou undefined", () => {
      expect(formatCurrencyBRL(null as unknown as undefined)).toBe("");
      expect(formatCurrencyBRL(undefined)).toBe("");
    });

    it("retorna string vazia quando o valor não é um número válido", () => {
      expect(formatCurrencyBRL("abc")).toBe("");
    });
  });

  describe("toNumberArray", () => {
    it("converte um array de strings numéricas em números", () => {
      expect(toNumberArray(["1", "2", "3"])).toEqual([1, 2, 3]);
    });

    it("filtra valores que não são números válidos", () => {
      expect(toNumberArray(["1", "abc", "3"])).toEqual([1, 3]);
    });

    it("retorna null quando o array resultante fica vazio", () => {
      expect(toNumberArray(["abc", "def"])).toBeNull();
    });

    it("retorna null quando o array de entrada é undefined ou null", () => {
      expect(toNumberArray(undefined)).toBeNull();
      expect(toNumberArray(null)).toBeNull();
    });
  });

  describe("cn", () => {
    it("combina classes simples", () => {
      expect(cn("a", "b")).toBe("a b");
    });

    it("mescla classes conflitantes do tailwind mantendo a última", () => {
      expect(cn("p-2", "p-4")).toBe("p-4");
    });

    it("ignora valores falsy", () => {
      expect(cn("a", false, undefined, null, "b")).toBe("a b");
    });
  });

  describe("formatCep", () => {
    it("formata um cep com 8 dígitos", () => {
      expect(formatCep("12345678")).toBe("12345-678");
    });

    it("formata um cep que já contém máscara", () => {
      expect(formatCep("12345-678")).toBe("12345-678");
    });

    it("retorna o valor original quando não possui 8 dígitos", () => {
      expect(formatCep("123")).toBe("123");
    });

    it("retorna string vazia para valores nulos ou undefined", () => {
      expect(formatCep(null)).toBe("");
      expect(formatCep(undefined)).toBe("");
      expect(formatCep("")).toBe("");
    });
  });

  describe("formatTelefone", () => {
    it("formata celular com 11 dígitos", () => {
      expect(formatTelefone("11987654321")).toBe("(11) 98765-4321");
    });

    it("formata telefone fixo com 10 dígitos", () => {
      expect(formatTelefone("1123456789")).toBe("(11) 2345-6789");
    });

    it("retorna o valor original para quantidade de dígitos inesperada", () => {
      expect(formatTelefone("123")).toBe("123");
    });

    it("retorna string vazia para valores nulos ou undefined", () => {
      expect(formatTelefone(null)).toBe("");
      expect(formatTelefone(undefined)).toBe("");
      expect(formatTelefone("")).toBe("");
    });
  });

  describe("formatDateTimeToPtBR", () => {
    it("formata uma data ISO válida para o padrão pt-BR", () => {
      const result = formatDateTimeToPtBR("2024-01-15T10:00:00.000Z");
      expect(result).toBe(
        new Date("2024-01-15T10:00:00.000Z").toLocaleDateString("pt-BR"),
      );
    });

    it("normaliza datas com nanosegundos extras antes de parsear", () => {
      const result = formatDateTimeToPtBR("2024-01-15T10:00:00.123456789Z");
      expect(result).toBe(
        new Date("2024-01-15T10:00:00.123Z").toLocaleDateString("pt-BR"),
      );
    });

    it("retorna string vazia para datas inválidas", () => {
      expect(formatDateTimeToPtBR("data-invalida")).toBe("");
    });
  });

  describe("formatSimpleDate", () => {
    it("converte uma data yyyy-mm-dd em dd/mm/yyyy", () => {
      expect(formatSimpleDate("2024-03-25")).toBe("25/03/2024");
    });
  });

  describe("handleWhatsApp", () => {
    const originalOpen = window.open;

    beforeEach(() => {
      window.open = jest.fn();
    });

    afterAll(() => {
      window.open = originalOpen;
    });

    it("não faz nada quando o telefone não é informado", () => {
      handleWhatsApp("");
      expect(window.open).not.toHaveBeenCalled();
    });

    it("abre o link do WhatsApp adicionando o código do Brasil", () => {
      handleWhatsApp("11987654321");
      expect(window.open).toHaveBeenCalledWith(
        "https://wa.me/5511987654321",
        "_blank",
      );
    });

    it("não duplica o código do Brasil quando o telefone já o possui", () => {
      handleWhatsApp("5511987654321");
      expect(window.open).toHaveBeenCalledWith(
        "https://wa.me/5511987654321",
        "_blank",
      );
    });
  });
});
