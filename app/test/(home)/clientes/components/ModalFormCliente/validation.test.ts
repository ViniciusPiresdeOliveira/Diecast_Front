import { clienteSchema } from "@/app/(home)/clientes/components/ModalFormCliente/validation";

describe("ModalFormCliente/validation (clienteSchema)", () => {
  it("é válido com nome, telefone (10 dígitos) e sem cep", async () => {
    await expect(
      clienteSchema.validate({
        nome: "João",
        telefone: "2199999999",
        cep: "",
        numeroResidencia: "",
      }),
    ).resolves.toBeTruthy();
  });

  it("é válido com telefone de 11 dígitos", async () => {
    await expect(
      clienteSchema.validate({
        nome: "João",
        telefone: "21999999999",
      }),
    ).resolves.toBeTruthy();
  });

  it("exige o nome", async () => {
    await expect(
      clienteSchema.validate({ nome: "", telefone: "2199999999" }),
    ).rejects.toThrow("Nome é obrigatório");
  });

  it("exige o telefone", async () => {
    await expect(
      clienteSchema.validate({ nome: "João", telefone: "" }),
    ).rejects.toThrow("Telefone é obrigatório");
  });

  it("rejeita telefone com quantidade de dígitos inválida", async () => {
    await expect(
      clienteSchema.validate({ nome: "João", telefone: "123" }),
    ).rejects.toThrow("Telefone inválido");
  });

  it("aceita telefone com máscara, considerando apenas os dígitos", async () => {
    await expect(
      clienteSchema.validate({ nome: "João", telefone: "(21) 99999-9999" }),
    ).resolves.toBeTruthy();
  });

  it("cep é opcional", async () => {
    await expect(
      clienteSchema.validate({
        nome: "João",
        telefone: "2199999999",
        cep: undefined,
      }),
    ).resolves.toBeTruthy();
  });

  it("rejeita cep com quantidade de dígitos inválida", async () => {
    await expect(
      clienteSchema.validate({
        nome: "João",
        telefone: "2199999999",
        cep: "123",
      }),
    ).rejects.toThrow("Cep inválido");
  });

  it("aceita cep válido com 8 dígitos", async () => {
    await expect(
      clienteSchema.validate({
        nome: "João",
        telefone: "2199999999",
        cep: "25010-160",
      }),
    ).resolves.toBeTruthy();
  });
});
