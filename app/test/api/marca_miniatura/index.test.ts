import api from "@/app/api";
import {
  deleteMarkMiniById,
  getAllMarksMini,
  postMarkMini,
} from "@/app/api/marca_miniatura";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe("@/app/api/marca_miniatura", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllMarksMini busca todas as marcas", () => {
    getAllMarksMini();
    expect(api.get).toHaveBeenCalledWith("/marcas-miniatura");
  });

  it("deleteMarkMiniById remove pelo id", () => {
    deleteMarkMiniById(7);
    expect(api.delete).toHaveBeenCalledWith("/marcas-miniatura/7");
  });

  it("postMarkMini cria uma nova marca", () => {
    postMarkMini({ nome: "Hot Wheels" });
    expect(api.post).toHaveBeenCalledWith("/marcas-miniatura", {
      nome: "Hot Wheels",
    });
  });
});
