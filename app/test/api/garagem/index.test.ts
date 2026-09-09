import api from "@/app/api";
import {
  deleteMiniInGarageAndReturnToSystem,
  deleteMiniInGarageAndSystem,
  getAllMinisByClient,
  postMiniInGarage,
} from "@/app/api/garagem";
import { PostMiniInGarageDTO } from "@/app/api/garagem/types";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe("@/app/api/garagem", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllMinisByClient busca as miniaturas do cliente", () => {
    getAllMinisByClient(2);
    expect(api.get).toHaveBeenCalledWith("/garagem/cliente/2");
  });

  it("postMiniInGarage envia a miniatura para a garagem", () => {
    const data: PostMiniInGarageDTO = {
      miniaturaId: 1,
      clienteId: 2,
      quantidade: 3,
    };
    postMiniInGarage(data);
    expect(api.post).toHaveBeenCalledWith("/garagem", data);
  });

  it("deleteMiniInGarageAndReturnToSystem devolve a miniatura ao estoque", () => {
    deleteMiniInGarageAndReturnToSystem(10);
    expect(api.delete).toHaveBeenCalledWith("/garagem/10/desistencia");
  });

  it("deleteMiniInGarageAndSystem marca como entregue", () => {
    deleteMiniInGarageAndSystem(10);
    expect(api.delete).toHaveBeenCalledWith("/garagem/10/entregue");
  });
});
