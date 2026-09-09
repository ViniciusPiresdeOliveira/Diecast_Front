import { MiniFormValues } from "@/app/(home)/components/ModalFormMini/validation";
import api from "@/app/api";
import {
  deleteMiniById,
  getFilterMiniatura,
  getMiniById,
  getMiniImageById,
  getSimilarMiniaturesById,
  postMiniatura,
  putAvailableQuantityMini,
  putMiniatura,
} from "@/app/api/miniatura";
import { FilterMiniatura } from "@/app/api/miniatura/types";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("@/app/api/miniatura", () => {
  afterEach(() => jest.clearAllMocks());

  const baseMini = {
    name: "Ferrari",
    brand: "1",
    types: ["1"],
    condition: "1",
    year: 1990,
    scale: "1:18",
    line: "1",
    price: 100,
    stockQty: 1,
    availableQty: 1,
    garageQty: 0,
    image: [],
  } as unknown as MiniFormValues;

  it("getFilterMiniatura envia o filtro via POST", () => {
    const filters = { nome: "Ferrari" } as unknown as FilterMiniatura;
    getFilterMiniatura(filters);
    expect(api.post).toHaveBeenCalledWith("/miniaturas/filtro", filters);
  });

  it("getSimilarMiniaturesById usa limite padrão de 15", () => {
    getSimilarMiniaturesById(1);
    expect(api.get).toHaveBeenCalledWith("/miniaturas/similares/1", {
      params: { limit: 15 },
    });
  });

  it("getSimilarMiniaturesById respeita o limite informado", () => {
    getSimilarMiniaturesById(1, 5);
    expect(api.get).toHaveBeenCalledWith("/miniaturas/similares/1", {
      params: { limit: 5 },
    });
  });

  it("getMiniImageById busca a imagem como blob", () => {
    getMiniImageById(3);
    expect(api.get).toHaveBeenCalledWith("/miniaturas/3/imagem", {
      responseType: "blob",
    });
  });

  it("getMiniById busca a miniatura pelo id", () => {
    getMiniById(3);
    expect(api.get).toHaveBeenCalledWith("/miniaturas/3");
  });

  it("deleteMiniById remove a miniatura pelo id", () => {
    deleteMiniById(3);
    expect(api.delete).toHaveBeenCalledWith("/miniaturas/3");
  });

  it("postMiniatura envia FormData com content-type multipart", () => {
    postMiniatura(baseMini);
    expect(api.post).toHaveBeenCalledWith("/miniaturas", expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" },
    });
  });

  it("putMiniatura atualiza a miniatura enviando FormData", () => {
    putMiniatura(baseMini, 3);
    expect(api.put).toHaveBeenCalledWith(
      "/miniaturas/3",
      expect.any(FormData),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  });

  it("putAvailableQuantityMini dá baixa no estoque", () => {
    putAvailableQuantityMini(3, 2);
    expect(api.patch).toHaveBeenCalledWith("/miniaturas/3/baixa-estoque/2");
  });
});
