import Home from "@/app/(home)/page";
import { getAllConditionMini } from "@/app/api/condicao_miniatura";
import { getAllScalesMini } from "@/app/api/escala_miniatura";
import { getAllLinesMini } from "@/app/api/linha_miniatura";
import { getAllMarksMini } from "@/app/api/marca_miniatura";
import { getFilterMiniatura } from "@/app/api/miniatura";
import { getAllTypesMini } from "@/app/api/tipo_miniatura";
import { useAuth } from "@/app/hooks/useAuth";
import { useFilter } from "@/app/hooks/useFilter";
import { useFilterLists } from "@/app/hooks/useFilterLists";
import { useFilterTrigger } from "@/app/hooks/useFilterTrigger";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";

jest.mock("@/app/hooks/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("@/app/hooks/useFilter", () => ({ useFilter: jest.fn() }));
jest.mock("@/app/hooks/useFilterLists", () => ({ useFilterLists: jest.fn() }));
jest.mock("@/app/hooks/useFilterTrigger", () => ({
  useFilterTrigger: jest.fn(),
}));
jest.mock("@/app/hooks/useLoading", () => ({ useLoading: jest.fn() }));

jest.mock("@/app/api/condicao_miniatura", () => ({
  getAllConditionMini: jest.fn(),
}));
jest.mock("@/app/api/escala_miniatura", () => ({
  getAllScalesMini: jest.fn(),
}));
jest.mock("@/app/api/linha_miniatura", () => ({
  getAllLinesMini: jest.fn(),
}));
jest.mock("@/app/api/marca_miniatura", () => ({
  getAllMarksMini: jest.fn(),
}));
jest.mock("@/app/api/tipo_miniatura", () => ({
  getAllTypesMini: jest.fn(),
}));
jest.mock("@/app/api/miniatura", () => ({
  deleteMiniById: jest.fn(),
  getFilterMiniatura: jest.fn(),
  putAvailableQuantityMini: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/app/(home)/components/Card", () => ({
  Card: ({ mini }: { mini: { nome: string } }) => (
    <div data-testid="card">{mini.nome}</div>
  ),
}));
jest.mock("@/app/(home)/components/Filter", () => ({
  Filter: () => <div data-testid="filter" />,
}));
jest.mock("@/app/(home)/components/MiniActions", () => ({
  MiniActions: () => <div data-testid="mini-actions" />,
}));
jest.mock("@/app/(home)/components/ModalFormMini", () => ({
  ModalFormMini: () => <div data-testid="modal-form-mini" />,
}));
jest.mock("@/app/(home)/components/ModalPhoto", () => ({
  ModalPhoto: () => <div data-testid="modal-photo" />,
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseFilter = useFilter as jest.Mock;
const mockedUseFilterLists = useFilterLists as jest.Mock;
const mockedUseFilterTrigger = useFilterTrigger as jest.Mock;
const mockedUseLoading = useLoading as jest.Mock;
const mockedGetFilterMiniatura = getFilterMiniatura as jest.Mock;

const emptyFilterResult = {
  data: {
    content: [],
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
    pageable: { pageSize: 30 },
  },
};

const miniFixture = {
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
  quantidadeEmGaragem: 0,
  quantidadeEstoque: 5,
};

describe("Home (app/(home)/page.tsx)", () => {
  const showLoading = jest.fn();
  const hideLoading = jest.fn();
  const handleChangeFilterLists = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseFilter.mockReturnValue({
      maxPrice: null,
      amount: 30,
      scale: null,
      minPrice: null,
      name: null,
      year: null,
      mark: null,
      line: null,
      type: null,
      condition: null,
    });
    mockedUseLoading.mockReturnValue({ showLoading, hideLoading });
    mockedUseFilterLists.mockReturnValue({
      filterLists: {
        marks: [],
        types: [],
        lines: [],
        conditions: [],
        scales: [],
      },
      handleChangeFilterLists,
    });
    mockedUseFilterTrigger.mockReturnValue({ filterTrigger: 0 });

    (getAllConditionMini as jest.Mock).mockResolvedValue({ data: [] });
    (getAllScalesMini as jest.Mock).mockResolvedValue({ data: [] });
    (getAllLinesMini as jest.Mock).mockResolvedValue({ data: [] });
    (getAllMarksMini as jest.Mock).mockResolvedValue({ data: [] });
    (getAllTypesMini as jest.Mock).mockResolvedValue({ data: [] });
    mockedGetFilterMiniatura.mockResolvedValue(emptyFilterResult);
  });

  it('exibe a mensagem de "nenhuma miniatura encontrada" quando a lista está vazia', async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<Home />);

    await waitFor(() =>
      expect(
        screen.getByText("Nenhuma miniatura encontrada"),
      ).toBeInTheDocument(),
    );
  });

  it("busca as listas de filtro (marcas, tipos, linhas, condições, escalas) ao montar", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    render(<Home />);

    await waitFor(() => {
      expect(getAllTypesMini).toHaveBeenCalled();
      expect(getAllMarksMini).toHaveBeenCalled();
      expect(getAllLinesMini).toHaveBeenCalled();
      expect(getAllConditionMini).toHaveBeenCalled();
      expect(getAllScalesMini).toHaveBeenCalled();
    });
  });

  it("renderiza os cards das miniaturas retornadas pelo filtro para usuário não logado", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    mockedGetFilterMiniatura.mockResolvedValue({
      data: {
        content: [miniFixture],
        totalPages: 1,
        totalElements: 1,
        numberOfElements: 1,
        pageable: { pageSize: 30 },
      },
    });

    render(<Home />);

    await waitFor(() =>
      expect(screen.getByTestId("card")).toHaveTextContent("Ferrari F40"),
    );
  });

  it("renderiza a tabela em vez de cards quando o usuário é ADMIN", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    mockedGetFilterMiniatura.mockResolvedValue({
      data: {
        content: [miniFixture],
        totalPages: 1,
        totalElements: 1,
        numberOfElements: 1,
        pageable: { pageSize: 30 },
      },
    });

    render(<Home />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());
    expect(screen.getByText("Ferrari F40")).toBeInTheDocument();
  });

  it("exibe toast de erro quando a busca de miniaturas falha", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    mockedGetFilterMiniatura.mockRejectedValue(new Error("erro de rede"));

    render(<Home />);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("abre o botão de adicionar miniatura apenas para ADMIN", async () => {
    mockedUseAuth.mockReturnValue({ user: { name: "Admin", role: "ADMIN" } });
    const { container } = render(<Home />);

    await waitFor(() =>
      expect(
        container.querySelector("svg.lucide-circle-plus"),
      ).toBeInTheDocument(),
    );
  });

  it("não exibe o botão de adicionar miniatura para usuário não ADMIN", async () => {
    mockedUseAuth.mockReturnValue({ user: null });
    const { container } = render(<Home />);

    await waitFor(() =>
      expect(
        screen.getByText("Nenhuma miniatura encontrada"),
      ).toBeInTheDocument(),
    );
    expect(
      container.querySelector("svg.lucide-circle-plus"),
    ).not.toBeInTheDocument();
  });
});
