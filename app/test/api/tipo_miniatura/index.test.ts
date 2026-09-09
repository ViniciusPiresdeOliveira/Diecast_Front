import api from "@/app/api";
import {
  deleteTypesMiniById,
  getAllTypesMini,
  postTypesMini,
} from "@/app/api/tipo_miniatura";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe("@/app/api/tipo_miniatura", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllTypesMini busca todos os tipos", () => {
    getAllTypesMini();
    expect(api.get).toHaveBeenCalledWith("/tipos-miniatura");
  });

  it("deleteTypesMiniById remove pelo id", () => {
    deleteTypesMiniById(9);
    expect(api.delete).toHaveBeenCalledWith("/tipos-miniatura/9");
  });

  it("postTypesMini cria um novo tipo", () => {
    postTypesMini({ nome: "Carro" });
    expect(api.post).toHaveBeenCalledWith("/tipos-miniatura", {
      nome: "Carro",
    });
  });
});
