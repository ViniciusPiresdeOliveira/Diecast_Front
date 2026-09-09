import { eventSchema } from "@/app/(home)/eventos/components/ModalFormEvento/validation";

const validEvent = {
  titulo: "Encontro de Colecionadores",
  data: "2024-05-10",
  descricao: "Descrição",
  imagens: [{}],
};

describe("ModalFormEvento/validation (eventSchema)", () => {
  it("é válido com todos os campos preenchidos corretamente", async () => {
    await expect(eventSchema.validate(validEvent)).resolves.toBeTruthy();
  });

  it("exige o título", async () => {
    await expect(
      eventSchema.validate({ ...validEvent, titulo: "" }),
    ).rejects.toThrow("Informe o título do evento");
  });

  it("rejeita título maior que 255 caracteres", async () => {
    await expect(
      eventSchema.validate({ ...validEvent, titulo: "a".repeat(256) }),
    ).rejects.toThrow("O título deve ter no máximo 255 caracteres");
  });

  it("exige a data do evento", async () => {
    await expect(
      eventSchema.validate({ ...validEvent, data: "" }),
    ).rejects.toThrow("Informe a data do evento");
  });

  it("descrição é opcional (default vazio)", async () => {
    const result = await eventSchema.validate({
      ...validEvent,
      descricao: undefined,
    });
    expect(result.descricao).toBe("");
  });

  it("rejeita descrição maior que 2000 caracteres", async () => {
    await expect(
      eventSchema.validate({ ...validEvent, descricao: "a".repeat(2001) }),
    ).rejects.toThrow("A descrição deve ter no máximo 2000 caracteres");
  });

  it("exige ao menos uma imagem", async () => {
    await expect(
      eventSchema.validate({ ...validEvent, imagens: [] }),
    ).rejects.toThrow("Adicione ao menos uma imagem");
  });
});
