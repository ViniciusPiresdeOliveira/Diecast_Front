import { ModalFormMini } from "@/app/(home)/components/ModalFormMini";
import { Miniatura } from "@/app/(home)/types";
import { postMiniatura, putMiniatura } from "@/app/api/miniatura";
import { useFilterLists } from "@/app/hooks/useFilterLists";
import { useLoading } from "@/app/hooks/useLoading";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
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
jest.mock("@/app/hooks/useFilterLists", () => ({ useFilterLists: jest.fn() }));
jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/hooks/useTypeDevice", () => ({ useTypeDevice: jest.fn() }));
jest.mock("@/app/api/miniatura", () => ({
  postMiniatura: jest.fn(),
  putMiniatura: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseFilterLists = useFilterLists as jest.Mock;
const mockedUseLoading = useLoading as jest.Mock;
const mockedUseTypeDevice = useTypeDevice as jest.Mock;
const mockedPostMiniatura = postMiniatura as jest.Mock;
const mockedPutMiniatura = putMiniatura as jest.Mock;

const filterLists = {
  marks: [{ id: 1, nome: "Hot Wheels" }],
  types: [{ id: 2, nome: "Carro" }],
  lines: [{ id: 3, nome: "Premium" }],
  conditions: [{ id: 4, nome: "Nova" }],
  scales: [{ id: 5, nome: "1:18" }],
};

const mini: Miniatura = {
  id: 10,
  nome: "Ferrari F40",
  marca: { id: 1, nome: "Hot Wheels" },
  tipos: [{ id: 2, nome: "Carro" }],
  condicao: { id: 4, nome: "Nova" },
  ano: 1990,
  escala: { id: 5, nome: "1:18" },
  linha: { id: 3, nome: "Premium" },
  valor: 150,
  quantidadeDisponivel: 8,
  quantidadeEmGaragem: 2,
  quantidadeEstoque: 10,
  imagem: "base64imagemfake",
};

describe("ModalFormMini", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const handleVisibleFormMini = jest.fn();
  const refreshMiniList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseFilterLists.mockReturnValue({ filterLists });
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedUseTypeDevice.mockReturnValue({ isMobile: false });
  });

  const setup = (
    overrides?: Partial<React.ComponentProps<typeof ModalFormMini>>,
  ) =>
    render(
      <ModalFormMini
        visible
        mini={null}
        type="add"
        handleVisibleFormMini={handleVisibleFormMini}
        refreshMiniList={refreshMiniList}
        {...overrides}
      />,
    );

  it('exibe o título "Criar Miniatura" quando type é add', () => {
    setup();
    expect(screen.getByText("Criar Miniatura")).toBeInTheDocument();
  });

  it('exibe o título "Editar Miniatura" quando type é edit', () => {
    setup({ type: "edit", mini });
    expect(screen.getByText("Editar Miniatura")).toBeInTheDocument();
  });

  it("preenche os campos com os dados da miniatura ao editar", () => {
    setup({ type: "edit", mini });

    expect(screen.getByDisplayValue("Ferrari F40")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1990")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(/R\$[\s\u00A0]*150,00/),
    ).toBeInTheDocument();
  });

  it("exibe os campos de quantidade disponível e em garagem apenas ao editar", () => {
    setup({ type: "edit", mini });

    expect(screen.getByText("Qtd Disponível")).toBeInTheDocument();
    expect(screen.getByText("Qtd Garagem")).toBeInTheDocument();
  });

  it("não exibe os campos de quantidade disponível/garagem ao criar", () => {
    setup();

    expect(screen.queryByText("Qtd Disponível")).not.toBeInTheDocument();
    expect(screen.queryByText("Qtd Garagem")).not.toBeInTheDocument();
  });

  it("aplica máscara de moeda ao digitar o preço", async () => {
    const user = userEvent.setup();
    setup();

    const priceInput = screen.getByDisplayValue("R$ 0,00");
    await user.type(priceInput, "1500");

    expect((priceInput as HTMLInputElement).value).toMatch(
      /R\$[\s\u00A0]*15,00/,
    );
  });

  it("chama handleVisibleFormMini e reseta o form ao cancelar", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(handleVisibleFormMini).toHaveBeenCalledWith("add");
  });

  it("desabilita o botão Salvar quando o form não foi alterado", () => {
    setup();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("exibe mensagens de erro ao tentar salvar com campos obrigatórios vazios", async () => {
    const user = userEvent.setup();
    setup({ type: "edit", mini });

    const nameInput = screen.getByDisplayValue("Ferrari F40");
    await user.clear(nameInput);
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Nome é obrigatório")).toBeInTheDocument();
  });

  it("atualiza uma miniatura existente com sucesso ao salvar", async () => {
    mockedPutMiniatura.mockResolvedValueOnce({});
    const user = userEvent.setup();
    setup({ type: "edit", mini });

    const nameInput = screen.getByDisplayValue("Ferrari F40");
    await user.type(nameInput, " Turbo");

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(mockedPutMiniatura).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Ferrari F40 Turbo" }),
        10,
      ),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Ferrari F40 Turbo atualizado com sucesso",
    );
    expect(refreshMiniList).toHaveBeenCalled();
    expect(handleVisibleFormMini).toHaveBeenCalledWith("edit");
  });

  it("exibe toast de erro quando a atualização falha", async () => {
    mockedPutMiniatura.mockRejectedValueOnce(new Error("Erro ao salvar"));
    const user = userEvent.setup();
    setup({ type: "edit", mini });

    const nameInput = screen.getByDisplayValue("Ferrari F40");
    await user.type(nameInput, " Turbo");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(refreshMiniList).not.toHaveBeenCalled();
  });

  it("atualiza a quantidade disponível automaticamente ao alterar a quantidade em estoque", async () => {
    const user = userEvent.setup();
    setup({ type: "edit", mini });

    // Qtd Estoque = 10 inicialmente; clicar em "+" deve atualizar Disponível (8 -> 9)
    const plusButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg.lucide-plus"));

    await user.click(plusButtons[0]); // primeiro seletor de quantidade é o de Estoque

    await waitFor(() => expect(screen.getByText("9")).toBeInTheDocument());
  });

  it("o botão de decrementar Qtd. Estoque respeita o mínimo (quantidade em garagem)", async () => {
    setup({
      type: "edit",
      mini: {
        ...mini,
        quantidadeEstoque: 2,
        quantidadeEmGaragem: 2,
        quantidadeDisponivel: 0,
      },
    });

    const minusButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg.lucide-minus"));

    // Qtd Estoque não pode ir abaixo da quantidade já em garagem (min = quantidadeEmGaragem)
    expect(minusButtons[0]).toBeDisabled();
  });

  it("os controles de Qtd Disponível e Qtd Garagem são somente leitura", () => {
    setup({ type: "edit", mini });

    const plusButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg.lucide-plus"));

    // estoque, disponível, garagem
    expect(plusButtons[1]).toBeDisabled();
    expect(plusButtons[2]).toBeDisabled();
  });
});
