import { MiniCard } from "@/app/(home)/mini/[id]/components/CardCarousel";
import { Miniatura } from "@/app/(home)/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

const mockedUseRouter = useRouter as jest.Mock;

const mini: Miniatura = {
  id: 7,
  nome: "Porsche 911",
  marca: { id: 1, nome: "Hot Wheels" },
  tipos: [],
  condicao: { id: 1, nome: "Nova" },
  ano: 2005,
  escala: { id: 1, nome: "1:18" },
  linha: { id: 1, nome: "Premium" },
  valor: 8000,
  quantidadeDisponivel: 3,
  quantidadeEmGaragem: 0,
  quantidadeEstoque: 3,
};

describe("MiniCard (CardCarousel)", () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push });
  });

  it("exibe o nome e o valor formatado da miniatura", () => {
    render(<MiniCard mini={mini} />);
    expect(screen.getByText("Porsche 911")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*8\.000,00/)).toBeInTheDocument();
  });

  it("exibe o ícone de imagem não encontrada quando não há imagem", () => {
    const { container } = render(<MiniCard mini={mini} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("navega para a página de detalhe ao clicar em Detalhe", async () => {
    const user = userEvent.setup();
    render(<MiniCard mini={mini} />);

    await user.click(screen.getByRole("button", { name: "Detalhe" }));
    expect(push).toHaveBeenCalledWith("/mini/7");
  });
});
