import { Miniatura } from "@/app/(home)/types";
import { getAllClientsByTerm } from "@/app/api/cliente";
import { postMiniInGarage } from "@/app/api/garagem";
import { ModalSetGarage } from "@/app/components/ModalSetGarage";
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
  getAllClientsByTerm: jest.fn(),
}));
jest.mock("@/app/api/garagem", () => ({
  postMiniInGarage: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseLoading = useLoading as jest.Mock;
const mockedGetAllClientsByTerm = getAllClientsByTerm as jest.Mock;
const mockedPostMiniInGarage = postMiniInGarage as jest.Mock;

const mini: Miniatura = {
  id: 1,
  nome: "Ferrari F40",
  marca: { id: 1, nome: "Hot Wheels" },
  tipos: [],
  condicao: { id: 1, nome: "Nova" },
  ano: 1990,
  escala: { id: 1, nome: "1:18" },
  linha: { id: 1, nome: "Premium" },
  valor: 100,
  quantidadeDisponivel: 5,
  quantidadeEmGaragem: 2,
  quantidadeEstoque: 7,
};

describe("ModalSetGarage", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const handleVisibleModal = jest.fn();
  const refreshList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
  });

  const setup = (
    overrides?: Partial<React.ComponentProps<typeof ModalSetGarage>>,
  ) =>
    render(
      <ModalSetGarage
        visible
        mini={mini}
        handleVisibleModal={handleVisibleModal}
        refreshList={refreshList}
        {...overrides}
      />,
    );

  it('exibe o título "Adicionar à Garagem"', () => {
    setup();
    expect(screen.getByText("Adicionar à Garagem")).toBeInTheDocument();
  });

  it("exibe as quantidades em estoque, disponível e em garagem da miniatura", () => {
    setup();

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("inicia com a quantidade a adicionar em 1", () => {
    setup();
    // "1" é o valor inicial do QuantitySelector "Qtd a Adicionar"
    expect(screen.getAllByText("1")).toHaveLength(1);
  });

  it("chama handleVisibleModal ao cancelar", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(handleVisibleModal).toHaveBeenCalledTimes(1);
  });

  it("desabilita o botão Salvar quando o form não foi alterado", () => {
    setup();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("busca clientes ao digitar no campo de busca (com debounce)", async () => {
    mockedGetAllClientsByTerm.mockResolvedValue({
      data: [{ id: 1, nome: "João", telefone: "21999999999" }],
    });
    const user = userEvent.setup();
    setup();

    const searchInput = document.querySelector(".ant-select-input") as Element;
    await user.type(searchInput, "Jo");

    await waitFor(
      () => expect(mockedGetAllClientsByTerm).toHaveBeenCalledWith("Jo"),
      { timeout: 2000 },
    );
  });

  it("aumenta a quantidade a adicionar ao clicar em +", async () => {
    const user = userEvent.setup();
    setup();

    const getQtyToAddValue = () =>
      Array.from(document.querySelectorAll("span.font-normal")).find(
        (el) => !el.className.includes("text-gray-400"),
      )?.textContent;

    expect(getQtyToAddValue()).toBe("1");

    const plusButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg.lucide-plus"));
    const enabledPlus = plusButtons.find(
      (btn) => !btn.hasAttribute("disabled"),
    );

    await user.click(enabledPlus as Element);

    await waitFor(() => expect(getQtyToAddValue()).toBe("2"));
  });

  it("não permite aumentar a quantidade além do disponível", async () => {
    setup({ mini: { ...mini, quantidadeDisponivel: 1 } });

    const plusButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg.lucide-plus"));

    // ordem: estoque, disponível, garagem, qtd a adicionar
    expect(plusButtons[3]).toBeDisabled();
  });

  it("cadastra a miniatura na garagem com sucesso ao salvar", async () => {
    mockedPostMiniInGarage.mockResolvedValueOnce({});
    const user = userEvent.setup();
    const { container } = render(
      <ModalSetGarage
        visible
        mini={mini}
        handleVisibleModal={handleVisibleModal}
        refreshList={refreshList}
      />,
    );

    // seleciona um cliente diretamente via antd Select (single, sem virtualization)
    mockedGetAllClientsByTerm.mockResolvedValueOnce({
      data: [{ id: 9, nome: "Maria", telefone: "21988887777" }],
    });

    const selector = container.querySelector(".ant-select-selector") as Element;
    await user.click(selector);
    await user.type(
      document.querySelector(".ant-select-input") as Element,
      "Maria",
    );

    await waitFor(() =>
      expect(mockedGetAllClientsByTerm).toHaveBeenCalledWith("Maria"),
    );

    const option = await screen.findByTitle("Maria - 21988887777");
    await user.click(option);

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(mockedPostMiniInGarage).toHaveBeenCalledWith({
        miniaturaId: 1,
        clienteId: 9,
        quantidade: 1,
      }),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Ferrari F40 adicionada à garagem com sucesso",
    );
    expect(refreshList).toHaveBeenCalled();
    expect(handleVisibleModal).toHaveBeenCalled();
  });
});
