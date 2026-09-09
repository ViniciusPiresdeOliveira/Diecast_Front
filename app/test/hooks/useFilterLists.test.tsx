import { act, renderHook } from "@testing-library/react";
import { FilterListsProvider } from "../../contexts/FilterListsContext";
import { useFilterLists } from "../../hooks/useFilterLists";

describe("useFilterLists", () => {
  it("lança erro quando usado fora do FilterListsProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useFilterLists())).toThrow(
      "useFilterLists deve ser usado dentro de FilterListsProvider",
    );
    spy.mockRestore();
  });

  it("retorna as listas vazias por padrão", () => {
    const { result } = renderHook(() => useFilterLists(), {
      wrapper: FilterListsProvider,
    });

    expect(result.current.filterLists).toEqual({
      marks: [],
      types: [],
      lines: [],
      conditions: [],
      scales: [],
    });
  });

  it("atualiza parcialmente as listas via handleChangeFilterLists", () => {
    const { result } = renderHook(() => useFilterLists(), {
      wrapper: FilterListsProvider,
    });

    act(() => {
      result.current.handleChangeFilterLists({
        marks: [{ id: 1, nome: "Hot Wheels" }] as never,
      });
    });

    expect(result.current.filterLists.marks).toHaveLength(1);
    expect(result.current.filterLists.types).toEqual([]);
  });
});
