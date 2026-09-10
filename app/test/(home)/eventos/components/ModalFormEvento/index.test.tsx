import { ModalFormEvento } from "@/app/(home)/eventos/components/ModalFormEvento";
import { Evento } from "@/app/(home)/eventos/types";
import { postEvent, putEvent } from "@/app/api/evento";
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
jest.mock("@/app/api/evento", () => ({
  postEvent: jest.fn(),
  putEvent: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseLoading = useLoading as jest.Mock;
const mockedPostEvent = postEvent as jest.Mock;
const mockedPutEvent = putEvent as jest.Mock;

const evento: Evento = {
  id: 5,
  titulo: "Encontro de Colecionadores",
  dataEvento: "2024-05-10",
  dataAtualizacao: "2024-05-01",
  dataCadastro: "2024-05-01",
  descricao: "Descrição do evento",
  imagens: [{ id: 1, imagem: "base64img", dataCadastro: "2024-05-01" }],
};

describe("ModalFormEvento", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const handleVisibleFormEvento = jest.fn();
  const refreshEventoList = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    window.scrollTo = jest.fn();
  });

  const setup = (
    overrides?: Partial<React.ComponentProps<typeof ModalFormEvento>>,
  ) =>
    render(
      <ModalFormEvento
        visible
        type="add"
        evento={null}
        handleVisibleFormEvento={handleVisibleFormEvento}
        refreshEventoList={refreshEventoList}
        {...overrides}
      />,
    );

  it('exibe o título "Novo evento" quando type é add', () => {
    setup();
    expect(screen.getByText("Novo evento")).toBeInTheDocument();
  });

  it('exibe o título "Editar evento" quando type é edit', () => {
    setup({ type: "edit", evento });
    expect(screen.getByText("Editar evento")).toBeInTheDocument();
  });

  it("preenche os campos com os dados do evento ao editar", () => {
    setup({ type: "edit", evento });

    expect(
      screen.getByDisplayValue("Encontro de Colecionadores"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Descrição do evento")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10/05/2024")).toBeInTheDocument();
  });

  it("chama handleVisibleFormEvento ao cancelar", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(handleVisibleFormEvento).toHaveBeenCalledWith("add");
  });

  it("desabilita o botão Salvar quando o form não foi alterado", () => {
    setup();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("exibe mensagem de erro ao tentar salvar com o título vazio", async () => {
    const user = userEvent.setup();
    setup({ type: "edit", evento });

    const tituloInput = screen.getByDisplayValue("Encontro de Colecionadores");
    await user.clear(tituloInput);
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(
      await screen.findByText("Informe o título do evento"),
    ).toBeInTheDocument();
  });

  it("atualiza um evento existente com sucesso ao salvar", async () => {
    mockedPutEvent.mockResolvedValueOnce({});
    const user = userEvent.setup();
    setup({ type: "edit", evento });

    const tituloInput = screen.getByDisplayValue("Encontro de Colecionadores");
    await user.type(tituloInput, " 2025");

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(mockedPutEvent).toHaveBeenCalledWith(5, expect.any(FormData)),
    );
    expect(toast.success).toHaveBeenCalledWith("Evento atualizado com sucesso");
    expect(refreshEventoList).toHaveBeenCalled();
    expect(handleVisibleFormEvento).toHaveBeenCalledWith("edit");
  });

  it("exibe toast de erro quando a atualização falha", async () => {
    mockedPutEvent.mockRejectedValueOnce(new Error("Erro ao salvar"));
    const user = userEvent.setup();
    setup({ type: "edit", evento });

    const tituloInput = screen.getByDisplayValue("Encontro de Colecionadores");
    await user.type(tituloInput, " 2025");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(refreshEventoList).not.toHaveBeenCalled();
  });

  it("exibe mensagem de erro quando não há imagens ao tentar salvar (modo add)", async () => {
    const user = userEvent.setup();
    setup({ type: "add" });

    await user.type(
      screen.getByPlaceholderText(/Encontro de Colecionadores 2025/),
      "Novo Encontro",
    );
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(
      await screen.findByText("Informe a data do evento"),
    ).toBeInTheDocument();
  });
});
