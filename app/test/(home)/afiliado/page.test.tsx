import Afiliado from "@/app/(home)/afiliado/page";
import {
  deleteLinksAffiliateById,
  getAllLinksAffiliate,
  postLinksAffiliate,
} from "@/app/api/link_afiliado";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("@/app/hooks/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/api/link_afiliado", () => ({
  getAllLinksAffiliate: jest.fn(),
  deleteLinksAffiliateById: jest.fn(),
  postLinksAffiliate: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseLoading = useLoading as jest.Mock;
const mockedGetAllLinksAffiliate = getAllLinksAffiliate as jest.Mock;
const mockedPostLinksAffiliate = postLinksAffiliate as jest.Mock;
const mockedDeleteLinksAffiliateById = deleteLinksAffiliateById as jest.Mock;

const links = [{ id: 1, link: "https://exemplo.com/produto" }];
const previews = [
  {
    url: "https://exemplo.com/produto",
    title: "Produto Exemplo",
    summary: "Resumo do produto",
    thumbnail: "https://exemplo.com/thumb.jpg",
  },
];

describe("Afiliado page", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    global.fetch = jest.fn().mockResolvedValue({ json: async () => previews });
    mockedGetAllLinksAffiliate.mockResolvedValue({ data: links });
  });

  it("busca os links de afiliado e exibe os previews ao montar", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<Afiliado />);

    await waitFor(() =>
      expect(screen.getByText("Produto Exemplo")).toBeInTheDocument(),
    );
    expect(screen.getByText("Resumo do produto")).toBeInTheDocument();
  });

  it("não exibe o input de cadastro de link para usuário não logado", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<Afiliado />);

    await waitFor(() => expect(mockedGetAllLinksAffiliate).toHaveBeenCalled());
    expect(
      screen.queryByPlaceholderText("Cole o link de afiliado aqui"),
    ).not.toBeInTheDocument();
  });

  it("exibe o input de cadastro de link para usuário logado", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    render(<Afiliado />);

    await waitFor(() =>
      expect(
        screen.getByPlaceholderText("Cole o link de afiliado aqui"),
      ).toBeInTheDocument(),
    );
  });

  it("cadastra um novo link de afiliado com sucesso", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    mockedPostLinksAffiliate.mockResolvedValueOnce({});
    const user = userEvent.setup();

    render(<Afiliado />);
    await waitFor(() =>
      expect(
        screen.getByPlaceholderText("Cole o link de afiliado aqui"),
      ).toBeInTheDocument(),
    );

    await user.type(
      screen.getByPlaceholderText("Cole o link de afiliado aqui"),
      "https://exemplo.com/novo",
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    await waitFor(() =>
      expect(mockedPostLinksAffiliate).toHaveBeenCalledWith({
        link: "https://exemplo.com/novo",
      }),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Link de Afiliado cadastrado com sucesso",
    );
  });

  it("não cadastra link quando o campo está vazio", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    const user = userEvent.setup();

    render(<Afiliado />);
    await waitFor(() =>
      expect(
        screen.getByPlaceholderText("Cole o link de afiliado aqui"),
      ).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    expect(mockedPostLinksAffiliate).not.toHaveBeenCalled();
  });

  it("abre o modal de confirmação e remove o link ao confirmar exclusão", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    mockedDeleteLinksAffiliateById.mockResolvedValueOnce({});
    const user = userEvent.setup();

    render(<Afiliado />);
    await waitFor(() =>
      expect(screen.getByText("Produto Exemplo")).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole("button");
    // primeiro botão é o de adicionar link, o segundo é o DeleteButton do preview
    await user.click(buttons[1]);

    expect(screen.getByText("Excluir link")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Excluir" }));

    await waitFor(() =>
      expect(mockedDeleteLinksAffiliateById).toHaveBeenCalledWith(1),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Link de Afiliado removido com sucesso",
    );
  });

  it("exibe toast de erro quando a busca de links falha", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    mockedGetAllLinksAffiliate.mockRejectedValueOnce(new Error("erro"));

    render(<Afiliado />);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
