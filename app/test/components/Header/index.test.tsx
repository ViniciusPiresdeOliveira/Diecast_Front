import { fetchLogout } from "@/app/api/logout";
import { Header } from "@/app/components/Header";
// import { OptionsOfNavigate } from "@/app/components/Header/utils";
import { useAuth } from "@/app/hooks/useAuth";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname, useRouter } from "next/navigation";

jest.mock("@/app/hooks/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/api/logout", () => ({ fetchLogout: jest.fn() }));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(props as never)} />;
  },
}));
jest.mock("@/app/components/Header/utils", () => ({
  OptionsOfNavigate: () => <div data-testid="options-of-navigate" />,
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseLoading = useLoading as jest.Mock;
const mockedUsePathname = usePathname as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;
const mockedFetchLogout = fetchLogout as jest.Mock;

describe("Header", () => {
  const push = jest.fn();
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const handleClearUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push });
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedUsePathname.mockReturnValue("/");
  });

  it('exibe "Diecast" quando não há usuário logado', () => {
    mockedUseAuth.mockReturnValue({ user: null, handleClearUser });
    render(<Header handleVisibilityMenu={jest.fn()} />);
    expect(screen.getByText("Diecast")).toBeInTheDocument();
  });

  it("exibe saudação com o nome do usuário quando logado", () => {
    mockedUseAuth.mockReturnValue({
      user: { name: "João", role: "USER" },
      handleClearUser,
    });
    render(<Header handleVisibilityMenu={jest.fn()} />);
    expect(screen.getByText("Olá, João")).toBeInTheDocument();
  });

  it("navega para a home ao clicar no logo", async () => {
    mockedUseAuth.mockReturnValue({ user: null, handleClearUser });
    const user = userEvent.setup();
    render(<Header handleVisibilityMenu={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: /Diecast/i }));
    expect(push).toHaveBeenCalledWith("/");
  });

  it("exibe botão de logout apenas para ADMIN", () => {
    mockedUseAuth.mockReturnValue({
      user: { name: "Admin", role: "ADMIN" },
      handleClearUser,
    });
    const { rerender } = render(<Header handleVisibilityMenu={jest.fn()} />);
    // logo + logout + menu mobile (pathname "/")
    expect(screen.getAllByRole("button")).toHaveLength(3);

    mockedUseAuth.mockReturnValue({
      user: { name: "User", role: "USER" },
      handleClearUser,
    });
    rerender(<Header handleVisibilityMenu={jest.fn()} />);
    // logo + menu mobile (sem logout)
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("realiza logout: mostra loading, chama fetchLogout e limpa o usuário", async () => {
    mockedFetchLogout.mockResolvedValueOnce({});
    mockedUseAuth.mockReturnValue({
      user: { name: "Admin", role: "ADMIN" },
      handleClearUser,
    });
    const user = userEvent.setup();
    render(<Header handleVisibilityMenu={jest.fn()} />);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]);

    expect(showLoading).toHaveBeenCalled();
    expect(mockedFetchLogout).toHaveBeenCalled();
    expect(hideLoading).toHaveBeenCalled();
    expect(handleClearUser).toHaveBeenCalled();
  });

  it("exibe o botão de menu mobile somente na home", () => {
    mockedUseAuth.mockReturnValue({ user: null, handleClearUser });
    mockedUsePathname.mockReturnValue("/afiliado");
    const handleVisibilityMenu = jest.fn();
    render(<Header handleVisibilityMenu={handleVisibilityMenu} />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
