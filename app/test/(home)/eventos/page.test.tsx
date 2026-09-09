import Eventos from "@/app/(home)/eventos/page";
import { deleteEventById, getAllEvents } from "@/app/api/evento";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("@/app/hooks/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/api/evento", () => ({
  getAllEvents: jest.fn(),
  deleteEventById: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@splidejs/react-splide", () => ({
  Splide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="splide">{children}</div>
  ),
  SplideSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="splide-slide">{children}</div>
  ),
}));
jest.mock("@/app/(home)/eventos/components/ModalFormEvento", () => ({
  ModalFormEvento: () => <div data-testid="modal-form-evento" />,
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseLoading = useLoading as jest.Mock;
const mockedGetAllEvents = getAllEvents as jest.Mock;
const mockedDeleteEventById = deleteEventById as jest.Mock;

const eventos = [
  {
    id: 1,
    titulo: "Encontro de Colecionadores",
    descricao: "Descrição do evento",
    dataEvento: "2024-05-10",
    imagens: [{ id: 1, imagem: "base64img" }],
  },
];

describe("Eventos page", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedGetAllEvents.mockResolvedValue({ data: eventos });
  });

  it('exibe a mensagem de "nenhum evento cadastrado" quando a lista está vazia', async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    mockedGetAllEvents.mockResolvedValueOnce({ data: [] });

    render(<Eventos />);

    await waitFor(() =>
      expect(screen.getByText("Nenhum evento cadastrado")).toBeInTheDocument(),
    );
  });

  it("busca e exibe os eventos ao montar", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<Eventos />);

    await waitFor(() =>
      expect(
        screen.getByText("Encontro de Colecionadores"),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText("Descrição do evento")).toBeInTheDocument();
  });

  it("não exibe botões de editar/excluir para usuário não ADMIN", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<Eventos />);

    await waitFor(() =>
      expect(
        screen.getByText("Encontro de Colecionadores"),
      ).toBeInTheDocument(),
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("exibe botões de editar/excluir e o de adicionar para ADMIN", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    render(<Eventos />);

    await waitFor(() =>
      expect(
        screen.getByText("Encontro de Colecionadores"),
      ).toBeInTheDocument(),
    );
    // editar + excluir = 2 botões (o "adicionar" é um ícone sem role button)
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("abre o modal de confirmação e exclui o evento", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    mockedDeleteEventById.mockResolvedValueOnce({});
    const user = userEvent.setup();

    render(<Eventos />);
    await waitFor(() =>
      expect(
        screen.getByText("Encontro de Colecionadores"),
      ).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]); // delete button

    expect(screen.getByText("Excluir evento")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Excluir" }));

    await waitFor(() => expect(mockedDeleteEventById).toHaveBeenCalledWith(1));
    expect(toast.success).toHaveBeenCalledWith(
      'Evento "Encontro de Colecionadores" apagado com sucesso',
    );
  });

  it("exibe toast de erro quando a busca de eventos falha", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    mockedGetAllEvents.mockRejectedValueOnce(new Error("erro"));

    render(<Eventos />);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
