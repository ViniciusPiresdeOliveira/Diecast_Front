import {
  defaultValuesForm,
  mapMiniaturaPayload,
  validateQuantities,
} from "@/app/(home)/components/ModalFormMini/utils";
import { MiniFormValues } from "@/app/(home)/components/ModalFormMini/validation";

describe("ModalFormMini/utils", () => {
  describe("defaultValuesForm", () => {
    it("possui os valores padrão esperados", () => {
      expect(defaultValuesForm).toEqual({
        id: 0,
        name: "",
        brand: undefined,
        types: undefined,
        condition: undefined,
        image: [],
        year: undefined,
        scale: undefined,
        line: undefined,
        price: 0,
        stockQty: 1,
        availableQty: 1,
        garageQty: 0,
      });
    });
  });

  describe("mapMiniaturaPayload", () => {
    it("mapeia os campos do formulário para o payload da API", () => {
      const mini = {
        name: "Ferrari F40",
        brand: "1",
        types: ["2", "3"],
        condition: "4",
        year: 1990,
        scale: "1:18",
        line: "5",
        price: 15000,
        stockQty: "10",
        availableQty: "8",
        garageQty: "2",
      } as unknown as MiniFormValues;

      expect(mapMiniaturaPayload(mini)).toEqual({
        nome: "Ferrari F40",
        marcaId: 1,
        tiposIds: [2, 3],
        condicaoId: 4,
        ano: 1990,
        escalaId: "1:18",
        linhaId: 5,
        valor: 150,
        quantidadeEstoque: 10,
        quantidadeDisponivel: 8,
        quantidadeEmGaragem: 2,
      });
    });

    it("usa array vazio para tiposIds quando types não é informado", () => {
      const mini = {
        name: "Mustang",
        brand: "1",
        types: undefined,
        condition: "2",
        year: 2000,
        scale: "1:24",
        line: "3",
        price: 5000,
        stockQty: 1,
        availableQty: 1,
        garageQty: 0,
      } as unknown as MiniFormValues;

      expect(mapMiniaturaPayload(mini).tiposIds).toEqual([]);
    });
  });

  describe("validateQuantities", () => {
    it("retorna null quando algum valor está indefinido", () => {
      expect(
        validateQuantities({
          stockQty: undefined,
          availableQty: 1,
          garageQty: 1,
        }),
      ).toBeNull();
      expect(
        validateQuantities({
          stockQty: 1,
          availableQty: undefined,
          garageQty: 1,
        }),
      ).toBeNull();
      expect(
        validateQuantities({
          stockQty: 1,
          availableQty: 1,
          garageQty: undefined,
        }),
      ).toBeNull();
    });

    it("retorna null quando estoque é igual à soma de disponível + garagem", () => {
      expect(
        validateQuantities({ stockQty: 10, availableQty: 6, garageQty: 4 }),
      ).toBeNull();
    });

    it("retorna erro quando a soma ultrapassa o estoque", () => {
      expect(
        validateQuantities({ stockQty: 10, availableQty: 8, garageQty: 4 }),
      ).toBe(
        "A soma de Qtd. Disponível + Qtd. Garagem não pode ser maior que o Qtd. Estoque",
      );
    });

    it("retorna erro quando estoque é diferente da soma (mas não ultrapassa)", () => {
      expect(
        validateQuantities({ stockQty: 10, availableQty: 5, garageQty: 3 }),
      ).toBe(
        "Qtd. Estoque tem quer igual à soma de Qtd. Disponível + Qtd. Garagem",
      );
    });
  });
});
