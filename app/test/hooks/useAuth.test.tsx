import { act, renderHook, waitFor } from "@testing-library/react";
import { getAuthMe } from "../../api/login";
import { AuthProvider } from "../../contexts/AuthProvider";
import { useAuth } from "../../hooks/useAuth";

jest.mock("../../api/login", () => ({
  getAuthMe: jest.fn(),
}));

const mockedGetAuthMe = getAuthMe as jest.MockedFunction<typeof getAuthMe>;

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("lança erro quando usado fora do AuthProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useFilter must be used within AuthProvider",
    );
    spy.mockRestore();
  });

  it("limpa o usuário quando não há token", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ hasToken: false }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.user).toBeNull());
    expect(mockedGetAuthMe).not.toHaveBeenCalled();
  });

  it("carrega o usuário quando há token e a API retorna dados válidos", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ hasToken: true }),
    });
    mockedGetAuthMe.mockResolvedValueOnce({
      data: { login: "joao", role: "ADMIN" },
    } as never);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() =>
      expect(result.current.user).toEqual({ name: "joao", role: "ADMIN" }),
    );
  });

  it("limpa o usuário e faz logout quando getAuthMe falha", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: async () => ({ hasToken: true }) })
      .mockResolvedValueOnce({ json: async () => ({}) });
    mockedGetAuthMe.mockRejectedValueOnce(new Error("unauthorized"));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.user).toBeNull());
    expect(global.fetch).toHaveBeenCalledWith("/api/logout", {
      method: "POST",
    });
  });

  it("handleUser e handleClearUser atualizam o estado manualmente", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ hasToken: false }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.user).toBeNull());

    act(() => {
      result.current.handleUser("Maria", "USER");
    });
    expect(result.current.user).toEqual({ name: "Maria", role: "USER" });

    act(() => {
      result.current.handleClearUser();
    });
    expect(result.current.user).toBeNull();
  });
});
