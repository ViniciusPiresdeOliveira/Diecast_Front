import { Card } from "@/app/(home)/components/Card";
import { Miniatura } from "@/app/(home)/types";
import { useAuth } from "@/app/hooks/useAuth";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

jest.mock("@/app/hooks/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("@/app/hooks/useTypeDevice", () => ({ useTypeDevice: jest.fn() }));
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(props as never)} />;
  },
}));
jest.mock("@/app/(home)/components/MiniActions", () => ({
  MiniActions: () => <div data-testid="mini-actions" />,
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseTypeDevice = useTypeDevice as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

const mini: Miniatura = {
  id: 1,
  nome: "Ferrari F40",
  marca: { id: 1, nome: "Hot Wheels" },
  tipos: [],
  condicao: { id: 1, nome: "Nova" },
  ano: 1990,
  escala: { id: 1, nome: "1:18" },
  linha: { id: 1, nome: "Premium" },
  valor: 15000,
  quantidadeDisponivel: 5,
  quantidadeEmGaragem: 0,
  quantidadeEstoque: 5,
};

describe("Card", () => {
  const push = jest.fn();
  const handleSelectedMini = jest.fn();
  const handleVisibleFormMini = jest.fn();
  const handleDeleteMiniById = jest.fn();
  const refreshMiniList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push });
    mockedUseTypeDevice.mockReturnValue({ isMobile: false });
  });

  const setup = (overrides?: Partial<Miniatura>) =>
    render(
      <Card
        mini={{ ...mini, ...overrides }}
        handleSelectedMini={handleSelectedMini}
        handleVisibleFormMini={handleVisibleFormMini}
        handleDeleteMiniById={handleDeleteMiniById}
        refreshMiniList={refreshMiniList}
      />,
    );

  it("exibe nome, ano e valor formatado da miniatura", () => {
    mockedUseAuth.mockReturnValue({ user: null });
    setup();

    expect(screen.getByText("Ferrari F40")).toBeInTheDocument();
    expect(screen.getByText("1990")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*15\.000,00/)).toBeInTheDocument();
  });

  it("exibe o ícone de imagem não encontrada quando não há imagem", () => {
    mockedUseAuth.mockReturnValue({ user: null });
    const { container } = setup();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("não exibe MiniActions quando o usuário não é ADMIN", () => {
    mockedUseAuth.mockReturnValue({ user: { name: "User", role: "USER" } });
    setup();
    expect(screen.queryByTestId("mini-actions")).not.toBeInTheDocument();
  });

  it("exibe MiniActions quando o usuário é ADMIN", () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    setup();
    expect(screen.getByTestId("mini-actions")).toBeInTheDocument();
  });

  it("navega para a página da miniatura ao clicar no card", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByText("Ferrari F40"));
    expect(push).toHaveBeenCalledWith("/mini/1");
  });
});
