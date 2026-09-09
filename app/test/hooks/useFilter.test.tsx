import { act, renderHook } from "@testing-library/react";
import { FilterProvider } from "../../contexts/FilterContext";
import { useFilter } from "../../hooks/useFilter";

describe("useFilter", () => {
  it("lança erro quando usado fora do FilterProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useFilter())).toThrow(
      "useFilter must be used within FilterProvider",
    );
    spy.mockRestore();
  });

  it("retorna os valores padrão dentro do FilterProvider", () => {
    const { result } = renderHook(() => useFilter(), {
      wrapper: FilterProvider,
    });

    expect(result.current.amount).toBe(30);
    expect(result.current.mark).toBeNull();
    expect(result.current.name).toBeNull();
  });

  it("atualiza o valor de mark via handleMark", () => {
    const { result } = renderHook(() => useFilter(), {
      wrapper: FilterProvider,
    });

    act(() => {
      result.current.handleMark(["Hot Wheels"]);
    });

    expect(result.current.mark).toEqual(["Hot Wheels"]);
  });

  it("atualiza name, year, minPrice e maxPrice", () => {
    const { result } = renderHook(() => useFilter(), {
      wrapper: FilterProvider,
    });

    act(() => {
      result.current.handleName("Ferrari");
      result.current.handleYear(1990);
      result.current.handleMinPrice(10);
      result.current.handleMaxPrice(100);
    });

    expect(result.current.name).toBe("Ferrari");
    expect(result.current.year).toBe(1990);
    expect(result.current.minPrice).toBe(10);
    expect(result.current.maxPrice).toBe(100);
  });

  it("clearFilters restaura os valores para o estado inicial", () => {
    const { result } = renderHook(() => useFilter(), {
      wrapper: FilterProvider,
    });

    act(() => {
      result.current.handleName("Ferrari");
      result.current.handleMark(["Hot Wheels"]);
      result.current.clearFilters();
    });

    expect(result.current.name).toBeNull();
    expect(result.current.mark).toBeNull();
  });
});
