import api from "@/app/api";
import { fetchLogin, getAuthMe } from "@/app/api/login";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

describe("@/app/api/login", () => {
  afterEach(() => jest.clearAllMocks());

  it("fetchLogin envia login e senha para autenticação", () => {
    const user = { login: "joao", password: "123456" };
    fetchLogin(user);
    expect(api.post).toHaveBeenCalledWith("/auth/login", user);
  });

  it("getAuthMe busca os dados do usuário autenticado", () => {
    getAuthMe();
    expect(api.get).toHaveBeenCalledWith("/auth/me");
  });
});
