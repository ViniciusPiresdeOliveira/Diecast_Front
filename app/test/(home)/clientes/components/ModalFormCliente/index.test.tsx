import { ModalFormCliente } from "@/app/(home)/clientes/components/ModalFormCliente";
import { postClient, putClient } from "@/app/api/cliente";
import { Cliente } from "@/app/api/cliente/types";
import { fetchAddressByCep } from "@/app/api/viacep";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(() => ({
      cookies: { delete: jest.fn() },
    })),
  },
}));
jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/api/cliente", () => ({
  postClient: jest.fn(),
  putClient: jest.fn(),
}));
jest.mock("@/app/api/viacep", () => ({
  fetchAddressByCep: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseLoading = useLoading as jest.Mock;
const mockedPostClient = postClient as jest.Mock;
const mockedPutClient = putClient as jest.Mock;
const mockedFetchAddressByCep = fetchAddressByCep as jest.Mock;

const cliente: Cliente = {
  id: 1,
  nome: "João",
  telefone: "21999999999",
  cep: "25010160",
  numeroResidencia: "10",
};

describe("ModalFormCliente", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const handleVisibleFormCliente = jest.fn();
  const refreshClienteList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedFetchAddressByCep.mockResolvedValue(null);
  });

  const setup = (
    overrides?: Partial<React.ComponentProps<typeof ModalFormCliente>>,
  ) =>
    render(
      <ModalFormCliente
        visible
        cliente={null}
        type="add"
        handleVisibleFormCliente={handleVisibleFormCliente}
        refreshClienteList={refreshClienteList}
        {...overrides}
      />,
    );

  it('exibe o título "Criar Cliente" quando type é add', () => {
    setup();
    expect(screen.getByText("Criar Cliente")).toBeInTheDocument();
  });

  it('exibe o título "Editar Cliente" quando type é edit', () => {
    setup({ type: "edit", cliente });
    expect(screen.getByText("Editar Cliente")).toBeInTheDocument();
  });

  it("preenche os campos com os dados do cliente ao editar", () => {
    setup({ type: "edit", cliente });

    expect(screen.getByDisplayValue("João")).toBeInTheDocument();
    expect(screen.getByDisplayValue("(21) 99999-9999")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25010-160")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
  });

  it("aplica máscara ao digitar o telefone", async () => {
    const user = userEvent.setup();
    setup();

    const telefoneInput = screen.getByPlaceholderText("(00) 00000-0000");
    await user.type(telefoneInput, "21999999999");

    expect(telefoneInput).toHaveValue("(21) 99999-9999");
  });

  it("aplica máscara ao digitar o cep", async () => {
    const user = userEvent.setup();
    setup();

    const cepInput = screen.getByPlaceholderText("00000-000");
    await user.type(cepInput, "25010160");

    expect(cepInput).toHaveValue("25010-160");
  });

  it("busca o endereço quando o cep atinge 8 dígitos e exibe os dados retornados", async () => {
    mockedFetchAddressByCep.mockResolvedValueOnce({
      logradouro: "Rua das Flores",
      bairro: "Centro",
      localidade: "Petrópolis",
      uf: "RJ",
    });
    const user = userEvent.setup();
    setup();

    const cepInput = screen.getByPlaceholderText("00000-000");
    await user.type(cepInput, "25010160");

    await waitFor(() =>
      expect(mockedFetchAddressByCep).toHaveBeenCalledWith("25010160"),
    );
    expect(await screen.findByText("Endereço encontrado")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rua das Flores")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Petrópolis")).toBeInTheDocument();
  });

  it("exibe mensagem de erro ao tentar salvar com o nome vazio", async () => {
    const user = userEvent.setup();
    setup({ type: "edit", cliente });

    const nomeInput = screen.getByDisplayValue("João");
    await user.clear(nomeInput);
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Nome é obrigatório")).toBeInTheDocument();
  });

  it("chama handleVisibleFormCliente e reseta o form ao cancelar", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(handleVisibleFormCliente).toHaveBeenCalledWith("add");
  });

  it("cadastra um novo cliente com sucesso ao salvar", async () => {
    mockedPostClient.mockResolvedValueOnce({});
    const user = userEvent.setup();
    setup();

    const nomeInputs = screen.getAllByRole("textbox");
    await user.type(nomeInputs[0], "Maria");
    await user.type(
      screen.getByPlaceholderText("(00) 00000-0000"),
      "21988888888",
    );

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(mockedPostClient).toHaveBeenCalledWith(
        expect.objectContaining({ nome: "Maria", telefone: "21988888888" }),
      ),
    );
    expect(toast.success).toHaveBeenCalledWith("Maria cadastrado com sucesso");
    expect(refreshClienteList).toHaveBeenCalled();
    expect(handleVisibleFormCliente).toHaveBeenCalledWith("add");
  });

  it("atualiza um cliente existente com sucesso ao salvar", async () => {
    mockedPutClient.mockResolvedValueOnce({});
    const user = userEvent.setup();
    setup({ type: "edit", cliente });

    const nomeInput = screen.getByDisplayValue("João");
    await user.clear(nomeInput);
    await user.type(nomeInput, "João Silva");

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(mockedPutClient).toHaveBeenCalledWith(
        expect.objectContaining({ nome: "João Silva" }),
        1,
      ),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "João Silva atualizado com sucesso",
    );
  });

  it("exibe toast de erro quando o cadastro falha", async () => {
    mockedPostClient.mockRejectedValueOnce(new Error("Erro ao salvar"));
    const user = userEvent.setup();
    setup();

    const nomeInputs = screen.getAllByRole("textbox");
    await user.type(nomeInputs[0], "Maria");
    await user.type(
      screen.getByPlaceholderText("(00) 00000-0000"),
      "21988888888",
    );

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(refreshClienteList).not.toHaveBeenCalled();
  });

  it("desabilita o botão Salvar quando o form não foi alterado", () => {
    setup();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });
});
