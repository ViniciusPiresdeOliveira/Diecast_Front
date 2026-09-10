import { ModalGaragemCliente } from "@/app/(home)/clientes/components/ModalGaragemCliente";
import { Cliente } from "@/app/api/cliente/types";
import { getAllMinisByClient } from "@/app/api/garagem";
import { useLoading } from "@/app/hooks/useLoading";
import { handleWhatsApp } from "@/app/utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/api/garagem", () => ({
  getAllMinisByClient: jest.fn(),
  deleteMiniInGarageAndReturnToSystem: jest.fn(),
  deleteMiniInGarageAndSystem: jest.fn(),
}));
jest.mock("@/app/api/viacep", () => ({ fetchAddressByCep: jest.fn() }));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));
jest.mock("@/app/utils", () => ({
  ...jest.requireActual("@/app/utils"),
  handleWhatsApp: jest.fn(),
}));

Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
});

const mockedUseLoading = useLoading as jest.Mock;
const mockedGetAllMinisByClient = getAllMinisByClient as jest.Mock;

const cliente: Cliente = {
  id: 1,
  nome: "João",
  telefone: "21999999999",
  cep: "25010160",
  numeroResidencia: "10",
};

const miniGaragem = {
  idMiniatura: 1,
  idGaragem: 100,
  nome: "Ferrari F40",
  marca: { id: 1, nome: "Hot Wheels" },
  tipos: [],
  condicao: { id: 1, nome: "Nova" },
  ano: 1990,
  escala: { id: 1, nome: "1:18" },
  linha: { id: 1, nome: "Premium" },
  valor: 15000,
  quantidadeEmGaragem: 1,
  dataCadastro: new Date().toISOString(),
};

describe("ModalGaragemCliente", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedGetAllMinisByClient.mockResolvedValue({
      data: { id: 1, nome: "João", miniaturas: [] },
    });
  });

  it('exibe "Miniaturas do Cliente" quando não há cliente selecionado', () => {
    render(<ModalGaragemCliente visible cliente={null} onClose={onClose} />);
    expect(screen.getByText("Miniaturas do Cliente")).toBeInTheDocument();
  });

  it("busca as miniaturas do cliente quando visível e com cliente definido", async () => {
    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() =>
      expect(mockedGetAllMinisByClient).toHaveBeenCalledWith(1),
    );
  });

  it("não busca miniaturas quando não visível", () => {
    render(
      <ModalGaragemCliente
        visible={false}
        cliente={cliente}
        onClose={onClose}
      />,
    );
    expect(mockedGetAllMinisByClient).not.toHaveBeenCalled();
  });

  it("exibe toast informativo quando o cliente não possui miniaturas", async () => {
    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith(
        "Nenhuma miniatura encontrada para este cliente.",
      ),
    );
  });

  it("exibe as miniaturas na tabela quando a busca retorna dados", async () => {
    mockedGetAllMinisByClient.mockResolvedValueOnce({
      data: { id: 1, nome: "João", miniaturas: [miniGaragem] },
    });

    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() =>
      expect(screen.getByText("Ferrari F40")).toBeInTheDocument(),
    );
    expect(screen.getByText(/R\$\s*15\.000,00/)).toBeInTheDocument();
  });

  it("exibe o nome e telefone formatado do cliente no título", async () => {
    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() =>
      expect(screen.getByText(/João - \(21\) 99999-9999/)).toBeInTheDocument(),
    );
  });

  it("chama handleWhatsApp ao clicar no nome do cliente", async () => {
    const user = userEvent.setup();
    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() =>
      expect(screen.getByText(/João - \(21\) 99999-9999/)).toBeInTheDocument(),
    );
    await user.click(screen.getByText(/João - \(21\) 99999-9999/));

    expect(handleWhatsApp).toHaveBeenCalledWith("21999999999");
  });

  it("não exibe o ícone de copiar mensagem quando não há miniaturas", async () => {
    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() => expect(mockedGetAllMinisByClient).toHaveBeenCalled());
    expect(document.querySelector("svg.lucide-copy")).not.toBeInTheDocument();
  });

  it("exibe o ícone de copiar mensagem quando há miniaturas na garagem", async () => {
    mockedGetAllMinisByClient.mockResolvedValueOnce({
      data: { id: 1, nome: "João", miniaturas: [miniGaragem] },
    });

    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() =>
      expect(screen.getByText("Ferrari F40")).toBeInTheDocument(),
    );
    expect(document.querySelector("svg.lucide-copy")).toBeInTheDocument();
  });

  it("limpa a lista e chama onClose ao fechar o modal", async () => {
    mockedGetAllMinisByClient.mockResolvedValueOnce({
      data: { id: 1, nome: "João", miniaturas: [miniGaragem] },
    });
    const user = userEvent.setup();

    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() =>
      expect(screen.getByText("Ferrari F40")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(hideLoading).toHaveBeenCalled();
  });

  it("exibe toast de erro quando a busca de miniaturas falha", async () => {
    mockedGetAllMinisByClient.mockRejectedValueOnce(new Error("erro de rede"));

    render(<ModalGaragemCliente visible cliente={cliente} onClose={onClose} />);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
