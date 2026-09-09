import { MiniGaragemActions } from "@/app/(home)/clientes/components/ModalGaragemCliente/components/MiniGaragemActions";
import {
  deleteMiniInGarageAndReturnToSystem,
  deleteMiniInGarageAndSystem,
} from "@/app/api/garagem";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/api/garagem", () => ({
  deleteMiniInGarageAndReturnToSystem: jest.fn(),
  deleteMiniInGarageAndSystem: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseLoading = useLoading as jest.Mock;
const mockedReturn = deleteMiniInGarageAndReturnToSystem as jest.Mock;
const mockedDelete = deleteMiniInGarageAndSystem as jest.Mock;

describe("MiniGaragemActions", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const onRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
  });

  it("abre o modal de retorno ao clicar no botão correspondente", async () => {
    const user = userEvent.setup();
    render(<MiniGaragemActions id={1} onRemove={onRemove} />);

    await user.click(screen.getByTitle("Retornar ao sistema"));
    expect(screen.getByText("Retornar miniatura")).toBeInTheDocument();
  });

  it("confirma o retorno da miniatura ao sistema com sucesso", async () => {
    mockedReturn.mockResolvedValueOnce({});
    const user = userEvent.setup();
    render(<MiniGaragemActions id={1} onRemove={onRemove} />);

    await user.click(screen.getByTitle("Retornar ao sistema"));
    await user.click(screen.getByRole("button", { name: "Retornar" }));

    await waitFor(() => expect(onRemove).toHaveBeenCalledWith(1));
    expect(mockedReturn).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith(
      "Miniatura retornada ao sistema!",
    );
    expect(showLoading).toHaveBeenCalled();
    expect(hideLoading).toHaveBeenCalled();
  });

  it("exibe toast de erro quando o retorno falha", async () => {
    mockedReturn.mockRejectedValueOnce(new Error("falhou"));
    const user = userEvent.setup();
    render(<MiniGaragemActions id={1} onRemove={onRemove} />);

    await user.click(screen.getByTitle("Retornar ao sistema"));
    await user.click(screen.getByRole("button", { name: "Retornar" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("confirma marcar como entregue com sucesso", async () => {
    mockedDelete.mockResolvedValueOnce({});
    const user = userEvent.setup();
    render(<MiniGaragemActions id={2} onRemove={onRemove} />);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]); // delete/entregue button

    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() => expect(onRemove).toHaveBeenCalledWith(2));
    expect(mockedDelete).toHaveBeenCalledWith(2);
    expect(toast.success).toHaveBeenCalledWith(
      "Miniatura marcada como entregue!",
    );
  });
});
