import Clientes from "@/app/(home)/clientes/page";
import { deleteClientById, getAllClientsByTerm } from "@/app/api/cliente";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("@/app/hooks/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/api/cliente", () => ({
  getAllClientsByTerm: jest.fn(),
  deleteClientById: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/app/(home)/clientes/components/ClientActions", () => ({
  ClientActions: ({ cliente }: { cliente: { nome: string } }) => (
    <div data-testid="client-actions">{cliente.nome}</div>
  ),
}));
jest.mock("@/app/(home)/clientes/components/ModalFormCliente", () => ({
  ModalFormCliente: () => <div data-testid="modal-form-cliente" />,
}));
jest.mock("@/app/(home)/clientes/components/ModalGaragemCliente", () => ({
  ModalGaragemCliente: () => <div data-testid="modal-garagem-cliente" />,
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseLoading = useLoading as jest.Mock;
const mockedGetAllClientsByTerm = getAllClientsByTerm as jest.Mock;
const mockedDeleteClientById = deleteClientById as jest.Mock;

const clientes = [
  { id: 1, nome: "João", telefone: "21999999999", cep: "25010160" },
];

describe("Clientes page", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ advanceTimers: true });
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    mockedGetAllClientsByTerm.mockResolvedValue({ data: clientes });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("busca e exibe os clientes ao montar", async () => {
    render(<Clientes />);

    await waitFor(() =>
      expect(mockedGetAllClientsByTerm).toHaveBeenCalledWith(""),
    );
    expect((await screen.findAllByText("João")).length).toBeGreaterThan(0);
  });

  it("busca clientes filtrando pelo termo digitado (com debounce)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Clientes />);
    await waitFor(() =>
      expect(mockedGetAllClientsByTerm).toHaveBeenCalledWith(""),
    );
    mockedGetAllClientsByTerm.mockClear();

    await user.type(
      screen.getByPlaceholderText(
        "Buscar por nome, telefone, cep ou número...",
      ),
      "Jo",
    );

    jest.advanceTimersByTime(700);

    await waitFor(() =>
      expect(mockedGetAllClientsByTerm).toHaveBeenCalledWith("Jo"),
    );
  });

  it("exibe toast de erro quando a busca de clientes falha", async () => {
    mockedGetAllClientsByTerm.mockRejectedValueOnce(new Error("erro"));
    render(<Clientes />);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
