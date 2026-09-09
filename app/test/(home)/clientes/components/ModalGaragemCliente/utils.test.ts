import { MiniGaragemCliente } from "@/app/(home)/clientes/components/ModalGaragemCliente/types";
import {
  buildEnderecoFromCep,
  buildGaragemMessage,
  calculateDaysInGarage,
  copyToClipboard,
} from "@/app/(home)/clientes/components/ModalGaragemCliente/utils";
import { fetchAddressByCep } from "@/app/api/viacep";

jest.mock("@/app/api/viacep", () => ({
  fetchAddressByCep: jest.fn(),
}));

const mockedFetchAddressByCep = fetchAddressByCep as jest.MockedFunction<
  typeof fetchAddressByCep
>;

describe("ModalGaragemCliente/utils", () => {
  describe("calculateDaysInGarage", () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-10T00:00:00.000Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("calcula corretamente a quantidade de dias em garagem", () => {
      expect(calculateDaysInGarage("2024-01-05T00:00:00.000Z")).toBe(5);
    });

    it("retorna 0 para datas inválidas", () => {
      expect(calculateDaysInGarage("data-invalida")).toBe(0);
    });

    it("retorna 0 quando a data é no futuro", () => {
      expect(calculateDaysInGarage("2024-02-01T00:00:00.000Z")).toBe(0);
    });

    it("normaliza datas com nanosegundos extras", () => {
      console.log(
        "pokdpdofkpf",
        calculateDaysInGarage("2024-01-05T00:00:00.123456789Z"),
      );
      expect(calculateDaysInGarage("2024-01-05T00:00:00.123456789Z")).toBe(4);
    });
  });

  describe("buildEnderecoFromCep", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("retorna mensagem pedindo o cep quando não informado", async () => {
      const result = await buildEnderecoFromCep({
        cep: undefined,
        numero: "10",
      });
      expect(result).toBe(
        "Por favor, informe seu CEP para que possamos validar o endereço de entrega.",
      );
      expect(mockedFetchAddressByCep).not.toHaveBeenCalled();
    });

    it("retorna mensagem de cep não encontrado quando a API retorna null", async () => {
      mockedFetchAddressByCep.mockResolvedValueOnce(null);
      const result = await buildEnderecoFromCep({ cep: "99999999" });
      expect(result).toBe(
        "Não foi possível localizar o endereço pelo CEP informado. Por favor, verifique e informe novamente.",
      );
    });

    it("monta o endereço completo a partir dos dados da API", async () => {
      mockedFetchAddressByCep.mockResolvedValueOnce({
        logradouro: "Rua A",
        bairro: "Centro",
        localidade: "Petrópolis",
        uf: "RJ",
      });

      const result = await buildEnderecoFromCep({
        cep: "25010160",
        numero: "95",
      });
      expect(result).toBe("Rua A, 95 - Centro, Petrópolis - RJ");
    });

    it('usa "s/n" quando o número não é informado', async () => {
      mockedFetchAddressByCep.mockResolvedValueOnce({
        logradouro: "Rua A",
        bairro: "Centro",
        localidade: "Petrópolis",
        uf: "RJ",
      });

      const result = await buildEnderecoFromCep({ cep: "25010160" });
      expect(result).toContain("s/n");
    });
  });

  describe("buildGaragemMessage", () => {
    const minis: MiniGaragemCliente[] = [
      {
        idMiniatura: 1,
        idGaragem: 1,
        nome: "Ferrari F40",
        marca: { id: 1, nome: "Hot Wheels" },
        tipos: [],
        condicao: { id: 1, nome: "Nova" },
        ano: 1990,
        escala: { id: 1, nome: "1:18" },
        linha: { id: 1, nome: "Premium" },
        valor: 100,
        quantidadeEmGaragem: 1,
      },
    ];

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("lista as miniaturas e inclui confirmação quando há cep", async () => {
      mockedFetchAddressByCep.mockResolvedValueOnce({
        logradouro: "Rua A",
        bairro: "Centro",
        localidade: "Petrópolis",
        uf: "RJ",
      });

      const message = await buildGaragemMessage({
        nome: "João",
        minis,
        cep: "25010160",
        numero: "95",
      });

      expect(message).toContain("Olá, *João*!");
      expect(message).toContain("Ferrari F40 - 1990");
      expect(message).toContain("Endereço de entrega");
      expect(message).toContain("Você confirma o envio");
    });

    it("não inclui confirmação nem endereço de entrega quando não há cep", async () => {
      const message = await buildGaragemMessage({
        nome: "Maria",
        minis,
        cep: undefined,
      });

      expect(message).toContain("📍 *Endereço:*");
      expect(message).not.toContain("Você confirma o envio");
    });

    it("indica quando não há miniaturas encontradas", async () => {
      const message = await buildGaragemMessage({
        nome: "Carlos",
        minis: [],
        cep: undefined,
      });

      expect(message).toContain("Nenhuma miniatura encontrada.");
    });
  });

  describe("copyToClipboard", () => {
    it("chama navigator.clipboard.writeText com o texto informado", async () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText } });

      await copyToClipboard("texto copiado");

      expect(writeText).toHaveBeenCalledWith("texto copiado");
    });
  });
});
