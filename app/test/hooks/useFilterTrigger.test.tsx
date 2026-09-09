import { act, renderHook } from "@testing-library/react";
import { FilterTriggerProvider } from "../../contexts/FilterTriggerContext";
import { useFilterTrigger } from "../../hooks/useFilterTrigger";

describe("useFilterTrigger", () => {
  it("lança erro quando usado fora do FilterTriggerProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useFilterTrigger())).toThrow(
      "useFilterTrigger deve ser usado dentro de FilterTriggerProvider",
    );
    spy.mockRestore();
  });

  it("inicia com filterTrigger igual a 0", () => {
    const { result } = renderHook(() => useFilterTrigger(), {
      wrapper: FilterTriggerProvider,
    });

    expect(result.current.filterTrigger).toBe(0);
  });

  it("incrementa filterTrigger a cada chamada de triggerFilter", () => {
    const { result } = renderHook(() => useFilterTrigger(), {
      wrapper: FilterTriggerProvider,
    });

    act(() => {
      result.current.triggerFilter();
    });
    expect(result.current.filterTrigger).toBe(1);

    act(() => {
      result.current.triggerFilter();
    });
    expect(result.current.filterTrigger).toBe(2);
  });
});
