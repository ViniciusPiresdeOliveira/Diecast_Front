import { garagemSchema } from "@/app/components/ModalSetGarage/validation";

describe("ModalSetGarage/validation (garagemSchema)", () => {
  it("é válido com clientId e quantity informados", async () => {
    await expect(
      garagemSchema.validate({ clientId: "1", quantity: 2 }),
    ).resolves.toBeTruthy();
  });

  it("exige o clientId", async () => {
    await expect(
      garagemSchema.validate({ clientId: "", quantity: 2 }),
    ).rejects.toThrow("Selecione um cliente");
  });

  it("exige a quantidade", async () => {
    await expect(
      garagemSchema.validate({ clientId: "1", quantity: undefined }),
    ).rejects.toThrow("Informe a quantidade");
  });

  it("rejeita quantidade menor que 1", async () => {
    await expect(
      garagemSchema.validate({ clientId: "1", quantity: 0 }),
    ).rejects.toThrow("A quantidade deve ser maior que zero");
  });
});
