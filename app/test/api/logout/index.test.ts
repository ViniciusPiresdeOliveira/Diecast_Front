import api from "@/app/api";
import { fetchLogout } from "@/app/api/logout";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
describe("@/app/api/logout", () => {
  afterEach(() => jest.clearAllMocks());

  it("fetchLogout chama o endpoint de logout", () => {
    fetchLogout();
    expect(api.post).toHaveBeenCalledWith("/auth/logout");
  });
});
