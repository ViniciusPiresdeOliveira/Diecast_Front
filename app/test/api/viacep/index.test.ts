import { fetchAddressByCep } from "@/app/api/viacep";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

describe("@/app/api/viacep (fetchAddressByCep)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("retorna null quando o cep não possui 8 dígitos", async () => {
    const result = await fetchAddressByCep("123");
    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("busca o endereço removendo caracteres não numéricos do cep", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ logradouro: "Rua A", uf: "RJ" }),
    });

    const result = await fetchAddressByCep("25010-160");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://viacep.com.br/ws/25010160/json/",
    );
    expect(result).toEqual({ logradouro: "Rua A", uf: "RJ" });
  });

  it("retorna null e mostra toast de erro quando a API indica cep não encontrado", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ erro: true }),
    });

    const result = await fetchAddressByCep("99999999");

    expect(result).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("CEP não encontrado!");
  });

  it("retorna null quando a requisição falha", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("network error"),
    );

    const result = await fetchAddressByCep("25010160");

    expect(result).toBeNull();
  });
});
