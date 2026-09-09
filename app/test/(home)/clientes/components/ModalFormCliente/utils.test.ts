import {
  defaultValuesForm,
  maskCep,
  maskTelefone,
  unmaskClienteForm,
} from "@/app/(home)/clientes/components/ModalFormCliente/utils";

describe("ModalFormCliente/utils", () => {
  describe("defaultValuesForm", () => {
    it("possui todos os campos vazios por padrão", () => {
      expect(defaultValuesForm).toEqual({
        nome: "",
        telefone: "",
        cep: "",
        numeroResidencia: "",
      });
    });
  });

  describe("maskTelefone", () => {
    it("aplica máscara de celular (11 dígitos)", () => {
      expect(maskTelefone("11987654321")).toBe("(11) 98765-4321");
    });

    it("aplica máscara parcial enquanto o usuário digita", () => {
      expect(maskTelefone("119876")).toBe("(11) 9876");
    });

    it("aplica máscara de telefone fixo (10 dígitos)", () => {
      expect(maskTelefone("1123456789")).toBe("(11) 2345-6789");
    });

    it("ignora caracteres não numéricos", () => {
      expect(maskTelefone("(11) 98765-4321")).toBe("(11) 98765-4321");
    });

    it("limita a entrada a 11 dígitos", () => {
      expect(maskTelefone("119876543219999")).toBe("(11) 98765-4321");
    });

    it("retorna apenas os dígitos quando há poucos caracteres", () => {
      expect(maskTelefone("11")).toBe("11");
    });
  });

  describe("maskCep", () => {
    it("aplica máscara de cep completo", () => {
      expect(maskCep("12345678")).toBe("12345-678");
    });

    it("limita a entrada a 8 dígitos", () => {
      expect(maskCep("123456789999")).toBe("12345-678");
    });

    it("ignora caracteres não numéricos", () => {
      expect(maskCep("12345-678")).toBe("12345-678");
    });

    it("retorna os dígitos sem separador quando incompleto", () => {
      expect(maskCep("1234")).toBe("1234");
    });
  });

  describe("unmaskClienteForm", () => {
    it("remove a máscara de telefone e cep", () => {
      const input = {
        nome: "João",
        telefone: "(11) 98765-4321",
        cep: "12345-678",
        numeroResidencia: "100",
      };

      expect(unmaskClienteForm(input)).toEqual({
        nome: "João",
        telefone: "11987654321",
        cep: "12345678",
        numeroResidencia: "100",
      });
    });

    it("mantém o cep como está (undefined/vazio) quando não informado", () => {
      const input = {
        nome: "Maria",
        telefone: "(21) 3333-4444",
        cep: "",
        numeroResidencia: "",
      };

      const result = unmaskClienteForm(input);
      expect(result.cep).toBe("");
      expect(result.telefone).toBe("2133334444");
    });
  });
});
