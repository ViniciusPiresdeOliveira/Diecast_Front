import api from "@/app/api";
import {
  deleteLinksAffiliateById,
  getAllLinksAffiliate,
  postLinksAffiliate,
} from "@/app/api/link_afiliado";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe("@/app/api/link_afiliado", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllLinksAffiliate busca todos os links de afiliado", () => {
    getAllLinksAffiliate();
    expect(api.get).toHaveBeenCalledWith("/link-afiliado");
  });

  it("deleteLinksAffiliateById remove pelo id", () => {
    deleteLinksAffiliateById(6);
    expect(api.delete).toHaveBeenCalledWith("/link-afiliado/6");
  });

  it("postLinksAffiliate cria um novo link de afiliado", () => {
    postLinksAffiliate({ link: "https://exemplo.com" });
    expect(api.post).toHaveBeenCalledWith("/link-afiliado", {
      link: "https://exemplo.com",
    });
  });
});
