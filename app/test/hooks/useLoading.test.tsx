import { act, renderHook } from "@testing-library/react";
import { LoadingProvider } from "../../contexts/LoagindContext";
import { useLoading } from "../../hooks/useLoading";

describe("useLoading", () => {
  it("lança erro quando usado fora do LoadingProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useLoading())).toThrow(
      "useLoading deve ser usado dentro de LoadingProvider",
    );
    spy.mockRestore();
  });

  it("inicia com loading false", () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: LoadingProvider,
    });

    expect(result.current.loading).toBe(false);
  });

  it("showLoading define loading como true", () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: LoadingProvider,
    });

    act(() => {
      result.current.showLoading();
    });

    expect(result.current.loading).toBe(true);
  });

  it("hideLoading define loading como false novamente", () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: LoadingProvider,
    });

    act(() => {
      result.current.showLoading();
      result.current.hideLoading();
    });

    expect(result.current.loading).toBe(false);
  });
});
