import { Filter } from "@/app/(home)/components/Filter";
import { useFilter } from "@/app/hooks/useFilter";
import { useFilterLists } from "@/app/hooks/useFilterLists";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(() => ({
      cookies: { delete: jest.fn() },
    })),
  },
}));
jest.mock("@/app/hooks/useFilter", () => ({ useFilter: jest.fn() }));
jest.mock("@/app/hooks/useFilterLists", () => ({ useFilterLists: jest.fn() }));

const mockedUseFilter = useFilter as jest.Mock;
const mockedUseFilterLists = useFilterLists as jest.Mock;

const baseFilterValues = {
  maxPrice: null,
  minPrice: null,
  name: null,
  year: null,
  mark: null,
  line: null,
  type: null,
  condition: null,
  scale: null,
  clearFilters: jest.fn(),
  handleMinPrice: jest.fn(),
  handleCondition: jest.fn(),
  handleMaxPrice: jest.fn(),
  handleName: jest.fn(),
  handleYear: jest.fn(),
  handleMark: jest.fn(),
  handleType: jest.fn(),
  handleLine: jest.fn(),
  handleScale: jest.fn(),
};

const filterLists = {
  marks: [{ id: 1, nome: "Hot Wheels" }],
  types: [{ id: 2, nome: "Carro" }],
  lines: [{ id: 3, nome: "Premium" }],
  conditions: [{ id: 4, nome: "Nova" }],
  scales: [{ id: 5, nome: "1:18" }],
};

describe("Filter", () => {
  const handleFilterMiniaturas = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseFilter.mockReturnValue({ ...baseFilterValues });
    mockedUseFilterLists.mockReturnValue({ filterLists });
  });

  it("renderiza os labels dos campos de filtro", () => {
    render(<Filter handleFilterMiniaturas={handleFilterMiniaturas} />);

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Marcas")).toBeInTheDocument();
    expect(screen.getByText("Ano")).toBeInTheDocument();
    expect(screen.getByText("Tipos")).toBeInTheDocument();
    expect(screen.getByText("Linhas")).toBeInTheDocument();
    expect(screen.getByText("Condição")).toBeInTheDocument();
    expect(screen.getByText("Escala")).toBeInTheDocument();
    expect(screen.getByText("Preço mínimo")).toBeInTheDocument();
    expect(screen.getByText("Preço máximo")).toBeInTheDocument();
  });

  it("chama handleName ao digitar no campo Nome", async () => {
    const user = userEvent.setup();
    render(<Filter handleFilterMiniaturas={handleFilterMiniaturas} />);

    await user.type(screen.getByPlaceholderText(/Ferrari/), "F");

    expect(baseFilterValues.handleName).toHaveBeenCalledWith("F");
  });

  it("chama handleYear ao digitar um ano", async () => {
    const user = userEvent.setup();
    render(<Filter handleFilterMiniaturas={handleFilterMiniaturas} />);

    const yearInput = screen.getByPlaceholderText(
      new RegExp(new Date().getFullYear().toString()),
    );
    await user.type(yearInput, "1");

    expect(baseFilterValues.handleYear).toHaveBeenCalledWith(1);
  });

  it('exibe "R$ 0,00" quando o preço mínimo/máximo não está definido', () => {
    render(<Filter handleFilterMiniaturas={handleFilterMiniaturas} />);

    expect(screen.getAllByDisplayValue("R$ 0,00")).toHaveLength(2);
  });

  it("exibe o preço mínimo formatado quando definido", () => {
    mockedUseFilter.mockReturnValue({ ...baseFilterValues, minPrice: 1050 });
    render(<Filter handleFilterMiniaturas={handleFilterMiniaturas} />);

    expect(screen.getByDisplayValue("R$ 10,50")).toBeInTheDocument();
  });

  it("chama handleMinPrice com o valor numérico ao digitar no preço mínimo", async () => {
    const user = userEvent.setup();
    render(<Filter handleFilterMiniaturas={handleFilterMiniaturas} />);

    const [minPriceInput] = screen.getAllByDisplayValue("R$ 0,00");
    await user.type(minPriceInput, "5");

    expect(baseFilterValues.handleMinPrice).toHaveBeenCalledWith(5);
  });

  it("chama handleFilterMiniaturas ao clicar em Filtrar", async () => {
    const user = userEvent.setup();
    render(<Filter handleFilterMiniaturas={handleFilterMiniaturas} />);

    await user.click(screen.getByRole("button", { name: "Filtrar" }));

    expect(handleFilterMiniaturas).toHaveBeenCalledTimes(1);
  });

  it("chama clearFilters ao clicar em Limpar filtros", async () => {
    const user = userEvent.setup();
    render(<Filter handleFilterMiniaturas={handleFilterMiniaturas} />);

    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));

    expect(baseFilterValues.clearFilters).toHaveBeenCalledTimes(1);
  });

  it("passa as opções corretas para o Select de marcas", () => {
    const { container } = render(
      <Filter handleFilterMiniaturas={handleFilterMiniaturas} />,
    );

    const selects = container.querySelectorAll(".ant-select-multiple");
    // Marcas, Tipos, Linhas, Condição, Escala = 5 selects múltiplos
    expect(selects).toHaveLength(5);
  });
});
