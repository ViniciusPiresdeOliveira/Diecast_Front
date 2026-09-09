import { miniSchema } from "@/app/(home)/components/ModalFormMini/validation";

const validMini = {
  name: "Ferrari F40",
  brand: "1",
  year: 1990,
  types: ["2"],
  line: "3",
  price: 100,
  stockQty: 10,
  availableQty: 8,
  garageQty: 2,
  condition: "4",
  scale: "5",
  image: [{}],
};

describe("ModalFormMini/validation (miniSchema)", () => {
  it("é válido quando todos os campos obrigatórios estão presentes", async () => {
    await expect(miniSchema.validate(validMini)).resolves.toBeTruthy();
  });

  it("exige o nome", async () => {
    await expect(
      miniSchema.validate({ ...validMini, name: "" }),
    ).rejects.toThrow("Nome é obrigatório");
  });

  it("exige que o ano seja um número", async () => {
    await expect(
      miniSchema.validate({ ...validMini, year: "abc" }),
    ).rejects.toThrow("Ano deve ser um número");
  });

  it("rejeita ano anterior a 1900", async () => {
    await expect(
      miniSchema.validate({ ...validMini, year: 1800 }),
    ).rejects.toThrow("Ano inválido");
  });

  it("rejeita ano no futuro", async () => {
    await expect(
      miniSchema.validate({ ...validMini, year: new Date().getFullYear() + 1 }),
    ).rejects.toThrow("Ano inválido");
  });

  it("exige ao menos um tipo selecionado", async () => {
    await expect(
      miniSchema.validate({ ...validMini, types: [] }),
    ).rejects.toThrow("Selecione ao menos um tipo");
  });

  it("rejeita preço negativo", async () => {
    await expect(
      miniSchema.validate({ ...validMini, price: -1 }),
    ).rejects.toThrow("Não pode ser negativo");
  });

  it("exige quantidade em estoque de no mínimo 1", async () => {
    await expect(
      miniSchema.validate({ ...validMini, stockQty: 0 }),
    ).rejects.toThrow("Tem que ser no mínimo 1");
  });

  it("exige ao menos uma imagem", async () => {
    await expect(
      miniSchema.validate({ ...validMini, image: [] }),
    ).rejects.toThrow("Imagem é obrigatório");
  });
});
