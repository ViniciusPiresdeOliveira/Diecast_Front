import api from "@/app/api";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(() => ({
      cookies: { delete: jest.fn() },
    })),
  },
}));

describe("@/app/api", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("cria a instância do axios com withCredentials habilitado", () => {
    expect(api.defaults.withCredentials).toBe(true);
  });

  it("repassa a resposta adiante no interceptor de sucesso", () => {
    const handler = (api.interceptors.response as any).handlers[0];
    const response = { status: 200, data: {} };
    expect(handler.fulfilled(response)).toBe(response);
  });

  it("repassa o config adiante no interceptor de request de sucesso", () => {
    const handler = (api.interceptors.request as any).handlers[0];
    const config = { url: "/teste" };
    expect(handler.fulfilled(config)).toBe(config);
  });

  it("rejeita a promise no interceptor de request quando há erro", async () => {
    const handler = (api.interceptors.request as any).handlers[0];
    const error = new Error("boom");
    await expect(handler.rejected(error)).rejects.toBe(error);
  });

  it("rejeita a promise para erros de resposta sem status 401/403", async () => {
    const handler = (api.interceptors.response as any).handlers[0];
    const error = { response: { status: 500 } };
    await expect(handler.rejected(error)).rejects.toBe(error);
  });

  it("rejeita a promise para erro 401 sem lançar exceção", async () => {
    const handler = (api.interceptors.response as any).handlers[0];
    const error = { response: { status: 401 } };
    await expect(handler.rejected(error)).rejects.toBe(error);
  });
});
