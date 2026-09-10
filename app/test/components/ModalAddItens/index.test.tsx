import { deleteMarkMiniById, postMarkMini } from "@/app/api/marca_miniatura";
import { deleteTypesMiniById, postTypesMini } from "@/app/api/tipo_miniatura";
import { ModalAddItens } from "@/app/components/ModalAddItens";
import { useFilterLists } from "@/app/hooks/useFilterLists";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/hooks/useFilterLists", () => ({ useFilterLists: jest.fn() }));
jest.mock("@/app/api/marca_miniatura", () => ({
  postMarkMini: jest.fn(),
  deleteMarkMiniById: jest.fn(),
}));
jest.mock("@/app/api/tipo_miniatura", () => ({
  postTypesMini: jest.fn(),
  deleteTypesMiniById: jest.fn(),
}));
jest.mock("@/app/api/linha_miniatura", () => ({
  postLineMini: jest.fn(),
  deleteLineMiniById: jest.fn(),
}));
jest.mock("@/app/api/condicao_miniatura", () => ({
  postConditionMini: jest.fn(),
  deleteConditionMiniById: jest.fn(),
}));
jest.mock("@/app/api/escala_miniatura", () => ({
  postScaleMini: jest.fn(),
  deleteScaleMiniById: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseLoading = useLoading as jest.Mock;
const mockedUseFilterLists = useFilterLists as jest.Mock;
const mockedPostMarkMini = postMarkMini as jest.Mock;
const mockedDeleteMarkMiniById = deleteMarkMiniById as jest.Mock;
const mockedPostTypesMini = postTypesMini as jest.Mock;
const mockedDeleteTypesMiniById = deleteTypesMiniById as jest.Mock;

const filterLists = {
  marks: [{ id: 1, nome: "Hot Wheels" }],
  types: [{ id: 2, nome: "Carro" }],
  lines: [{ id: 3, nome: "Premium" }],
  conditions: [{ id: 4, nome: "Nova" }],
  scales: [{ id: 5, nome: "1:18" }],
};

describe("ModalAddItens", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const handleChangeFilterLists = jest.fn();
  const handleVisibility = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedUseFilterLists.mockReturnValue({
      filterLists,
      handleChangeFilterLists,
    });
  });

  const setup = (
    overrides?: Partial<React.ComponentProps<typeof ModalAddItens>>,
  ) =>
    render(
      <ModalAddItens
        title="Marca"
        typeAdd="marca"
        isVisible
        handleVisibility={handleVisibility}
        {...overrides}
      />,
    );

  it("exibe o título com o nome do item gerenciado", () => {
    setup();
    expect(screen.getByText("Gerenciar Marca")).toBeInTheDocument();
  });

  it("exibe a lista de itens correspondente ao typeAdd na tabela", () => {
    setup();
    expect(screen.getByText("Hot Wheels")).toBeInTheDocument();
  });

  it("exibe a lista de tipos quando typeAdd é tipos", () => {
    setup({ title: "Tipo", typeAdd: "tipos" });
    expect(screen.getByText("Carro")).toBeInTheDocument();
    expect(screen.queryByText("Hot Wheels")).not.toBeInTheDocument();
  });

  it("chama handleVisibility ao fechar o modal", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(handleVisibility).toHaveBeenCalledTimes(1);
  });

  it("não chama a API de criação quando o campo está vazio", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(mockedPostMarkMini).not.toHaveBeenCalled();
  });

  it("cadastra um novo item com sucesso e atualiza a lista de filtros", async () => {
    mockedPostMarkMini.mockResolvedValueOnce({
      data: { id: 6, nome: "Matchbox" },
    });
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Adicionar Marca"), "Matchbox");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await waitFor(() =>
      expect(mockedPostMarkMini).toHaveBeenCalledWith({ nome: "Matchbox" }),
    );
    expect(toast.success).toHaveBeenCalledWith("Matchbox criado com sucesso");
    expect(handleChangeFilterLists).toHaveBeenCalledWith({
      marks: [
        { id: 1, nome: "Hot Wheels" },
        { id: 6, nome: "Matchbox" },
      ],
    });
  });

  it("cadastra um novo tipo com sucesso quando typeAdd é tipos", async () => {
    mockedPostTypesMini.mockResolvedValueOnce({
      data: { id: 7, nome: "Caminhão" },
    });
    const user = userEvent.setup();
    setup({ title: "Tipo", typeAdd: "tipos" });

    await user.type(screen.getByPlaceholderText("Adicionar Tipo"), "Caminhão");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await waitFor(() =>
      expect(mockedPostTypesMini).toHaveBeenCalledWith({ nome: "Caminhão" }),
    );
    expect(handleChangeFilterLists).toHaveBeenCalledWith({
      types: [
        { id: 2, nome: "Carro" },
        { id: 7, nome: "Caminhão" },
      ],
    });
  });

  it("exibe toast de erro quando o cadastro falha", async () => {
    mockedPostMarkMini.mockRejectedValueOnce(new Error("Erro ao criar"));
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Adicionar Marca"), "X");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("abre o modal de confirmação ao clicar em excluir", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "" }));
    expect(screen.getByText("Excluir marca")).toBeInTheDocument();
    expect(screen.getAllByText("Hot Wheels").length).toBeGreaterThan(0);
  });

  it("exclui um item com sucesso ao confirmar no modal", async () => {
    mockedDeleteMarkMiniById.mockResolvedValueOnce({});
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "" }));
    await user.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() =>
      expect(mockedDeleteMarkMiniById).toHaveBeenCalledWith(1),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Hot Wheels excluído com sucesso",
    );
    expect(handleChangeFilterLists).toHaveBeenCalledWith({ marks: [] });
  });

  it("cancela a exclusão sem chamar a API", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "" }));
    await user.click(screen.getByRole("button", { name: "Não" }));

    expect(mockedDeleteMarkMiniById).not.toHaveBeenCalled();
  });

  it("exibe toast de erro quando a exclusão falha", async () => {
    mockedDeleteMarkMiniById.mockRejectedValueOnce(
      new Error("Erro ao excluir"),
    );
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "" }));
    await user.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
