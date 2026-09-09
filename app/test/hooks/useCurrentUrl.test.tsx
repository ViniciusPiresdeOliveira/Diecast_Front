import { renderHook } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { useCurrentUrl } from "../../hooks/useCurrentUrl";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.Mock;

describe("useCurrentUrl", () => {
  it("retorna a origin combinada com o pathname atual", () => {
    mockedUsePathname.mockReturnValue("/eventos");

    const { result } = renderHook(() => useCurrentUrl());

    expect(result.current).toBe(`${window.location.origin}/eventos`);
  });

  it("reflete mudanças de pathname entre renders", () => {
    mockedUsePathname.mockReturnValue("/afiliado");
    const { result, rerender } = renderHook(() => useCurrentUrl());
    expect(result.current).toBe(`${window.location.origin}/afiliado`);

    mockedUsePathname.mockReturnValue("/clientes");
    rerender();
    expect(result.current).toBe(`${window.location.origin}/clientes`);
  });
});
