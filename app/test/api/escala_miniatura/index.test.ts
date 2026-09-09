import api from "@/app/api";
import {
  deleteScaleMiniById,
  getAllScalesMini,
  postScaleMini,
} from "@/app/api/escala_miniatura";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe("@/app/api/escala_miniatura", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllScalesMini busca todas as escalas", () => {
    getAllScalesMini();
    expect(api.get).toHaveBeenCalledWith("/escalas-miniatura");
  });

  it("deleteScaleMiniById remove pelo id", () => {
    deleteScaleMiniById(2);
    expect(api.delete).toHaveBeenCalledWith("/escalas-miniatura/2");
  });

  it("postScaleMini cria uma nova escala", () => {
    postScaleMini({ nome: "1:18" });
    expect(api.post).toHaveBeenCalledWith("/escalas-miniatura", {
      nome: "1:18",
    });
  });
});
