import api from "@/app/api";
import {
  deleteConditionMiniById,
  getAllConditionMini,
  postConditionMini,
} from "@/app/api/condicao_miniatura";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe("@/app/api/condicao_miniatura", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllConditionMini busca todas as condições", () => {
    getAllConditionMini();
    expect(api.get).toHaveBeenCalledWith("/condicao-miniatura");
  });

  it("deleteConditionMiniById remove pelo id", () => {
    deleteConditionMiniById(3);
    expect(api.delete).toHaveBeenCalledWith("/condicao-miniatura/3");
  });

  it("postConditionMini cria uma nova condição", () => {
    postConditionMini({ nome: "Nova" });
    expect(api.post).toHaveBeenCalledWith("/condicao-miniatura", {
      nome: "Nova",
    });
  });
});
