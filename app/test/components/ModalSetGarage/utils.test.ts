import {
  defaultValuesForm,
  validateGarageQuantity,
} from "@/app/components/ModalSetGarage/utils";

describe("ModalSetGarage/utils", () => {
  describe("defaultValuesForm", () => {
    it("possui os valores padrão esperados", () => {
      expect(defaultValuesForm).toEqual({ clientId: "", quantity: 1 });
    });
  });

  describe("validateGarageQuantity", () => {
    it("retorna mensagem de erro quando a quantidade excede o disponível", () => {
      expect(validateGarageQuantity({ quantity: 5, availableQty: 3 })).toBe(
        "Quantidade maior que a disponível em estoque",
      );
    });

    it("retorna null quando a quantidade é igual ao disponível", () => {
      expect(
        validateGarageQuantity({ quantity: 3, availableQty: 3 }),
      ).toBeNull();
    });

    it("retorna null quando a quantidade é menor que o disponível", () => {
      expect(
        validateGarageQuantity({ quantity: 1, availableQty: 3 }),
      ).toBeNull();
    });
  });
});
