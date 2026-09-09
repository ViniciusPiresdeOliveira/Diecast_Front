import api from "@/app/api";
import {
  deleteLineMiniById,
  getAllLinesMini,
  postLineMini,
} from "@/app/api/linha_miniatura";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe("@/app/api/linha_miniatura", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllLinesMini busca todas as linhas", () => {
    getAllLinesMini();
    expect(api.get).toHaveBeenCalledWith("/linhas-miniatura");
  });

  it("deleteLineMiniById remove pelo id", () => {
    deleteLineMiniById(4);
    expect(api.delete).toHaveBeenCalledWith("/linhas-miniatura/4");
  });

  it("postLineMini cria uma nova linha", () => {
    postLineMini({ nome: "Premium" });
    expect(api.post).toHaveBeenCalledWith("/linhas-miniatura", {
      nome: "Premium",
    });
  });
});
