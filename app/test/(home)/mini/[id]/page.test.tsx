import MiniDetail from "@/app/(home)/mini/[id]/page";
import { handleRedirectToWhatsApp } from "@/app/(home)/utils";
import { getMiniById, getSimilarMiniaturesById } from "@/app/api/miniatura";
import { useAuth } from "@/app/hooks/useAuth";
import { useCurrentUrl } from "@/app/hooks/useCurrentUrl";
import { useLoading } from "@/app/hooks/useLoading";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

jest.mock("@/app/hooks/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("@/app/hooks/useCurrentUrl", () => ({ useCurrentUrl: jest.fn() }));
jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("@/app/hooks/useTypeDevice", () => ({ useTypeDevice: jest.fn() }));
jest.mock("next/navigation", () => ({ useParams: jest.fn() }));
jest.mock("@/app/api/miniatura", () => ({
  deleteMiniById: jest.fn(),
  getMiniById: jest.fn(),
  getSimilarMiniaturesById: jest.fn(),
  putAvailableQuantityMini: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/app/(home)/utils", () => ({
  ...jest.requireActual("@/app/(home)/utils"),
  handleRedirectToWhatsApp: jest.fn(),
}));
jest.mock("@splidejs/react-splide", () => ({
  Splide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="splide">{children}</div>
  ),
  SplideSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="splide-slide">{children}</div>
  ),
}));
jest.mock("@/app/(home)/components/MiniActions", () => ({
  MiniActions: () => <div data-testid="mini-actions" />,
}));
jest.mock("@/app/(home)/components/ModalFormMini", () => ({
  ModalFormMini: () => <div data-testid="modal-form-mini" />,
}));
jest.mock("@/app/(home)/mini/[id]/components/CardCarousel", () => ({
  MiniCard: ({ mini }: { mini: { nome: string } }) => (
    <div data-testid="mini-card">{mini.nome}</div>
  ),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseCurrentUrl = useCurrentUrl as jest.Mock;
const mockedUseLoading = useLoading as jest.Mock;
const mockedUseTypeDevice = useTypeDevice as jest.Mock;
const mockedUseParams = useParams as jest.Mock;
const mockedGetMiniById = getMiniById as jest.Mock;
const mockedGetSimilarMiniaturesById = getSimilarMiniaturesById as jest.Mock;

const mini = {
  id: 5,
  nome: "Ferrari F40",
  marca: { id: 1, nome: "Hot Wheels" },
  tipos: [{ nome: "Carro" }],
  condicao: { id: 1, nome: "Nova" },
  ano: 1990,
  escala: { id: 1, nome: "1:18" },
  linha: { id: 1, nome: "Premium" },
  valor: 15000,
  quantidadeDisponivel: 5,
  quantidadeEmGaragem: 0,
  quantidadeEstoque: 5,
};

const similarMinis = [{ ...mini, id: 6, nome: "Porsche 911" }];

describe("MiniDetail page", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseParams.mockReturnValue({ id: "5" });
    mockedUseCurrentUrl.mockReturnValue("http://localhost/mini/5");
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedUseTypeDevice.mockReturnValue({ isMobile: false });
    mockedGetMiniById.mockResolvedValue({ data: mini });
    mockedGetSimilarMiniaturesById.mockResolvedValue({ data: similarMinis });
  });

  it("busca os dados da miniatura e das similares pelo id da rota", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<MiniDetail />);

    await waitFor(() => expect(mockedGetMiniById).toHaveBeenCalledWith(5));
    expect(mockedGetSimilarMiniaturesById).toHaveBeenCalledWith(5);
  });

  it("exibe os dados da miniatura carregada", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<MiniDetail />);

    await waitFor(() =>
      expect(screen.getByText("Ferrari F40")).toBeInTheDocument(),
    );
    expect(screen.getByText("Hot Wheels")).toBeInTheDocument();
    expect(screen.getByText("1990")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*15\.000,00/)).toBeInTheDocument();
  });

  it("exibe as miniaturas similares no carrossel", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<MiniDetail />);

    await waitFor(() =>
      expect(screen.getByTestId("mini-card")).toHaveTextContent("Porsche 911"),
    );
  });

  it("não exibe MiniActions quando não há usuário logado", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<MiniDetail />);

    await waitFor(() =>
      expect(screen.getByText("Ferrari F40")).toBeInTheDocument(),
    );
    expect(screen.queryByTestId("mini-actions")).not.toBeInTheDocument();
  });

  it("exibe MiniActions quando há usuário logado", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    render(<MiniDetail />);

    await waitFor(() =>
      expect(screen.getByTestId("mini-actions")).toBeInTheDocument(),
    );
  });

  it("chama handleRedirectToWhatsApp ao clicar em comprar pelo WhatsApp", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    const user = userEvent.setup();
    render(<MiniDetail />);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Comprar pelo WhatsApp/i }),
      ).toBeInTheDocument(),
    );

    await user.click(
      screen.getByRole("button", { name: /Comprar pelo WhatsApp/i }),
    );

    expect(handleRedirectToWhatsApp).toHaveBeenCalledWith(
      mini,
      "http://localhost/mini/5",
      false,
    );
  });

  it("exibe toast de erro quando a busca da miniatura falha", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    mockedGetMiniById.mockRejectedValueOnce(new Error("erro"));

    render(<MiniDetail />);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
