import { ClienteFormValues } from "@/app/(home)/clientes/components/ModalFormCliente/validation";
import api from "@/app/api";
import {
  deleteClientById,
  getAllClientsByTerm,
  postClient,
  putClient,
} from "@/app/api/cliente";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("@/app/api/cliente", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllClientsByTerm busca clientes pelo termo informado", () => {
    getAllClientsByTerm("joao");
    expect(api.get).toHaveBeenCalledWith("/cliente/search?termo=joao");
  });

  it("deleteClientById remove o cliente pelo id", () => {
    deleteClientById(5);
    expect(api.delete).toHaveBeenCalledWith("/cliente/5");
  });

  it("postClient envia os dados do novo cliente", () => {
    const client = { nome: "João" } as ClienteFormValues;
    postClient(client);
    expect(api.post).toHaveBeenCalledWith("/cliente", client);
  });

  it("putClient atualiza o cliente pelo id", () => {
    const client = { nome: "João" } as ClienteFormValues;
    putClient(client, 5);
    expect(api.put).toHaveBeenCalledWith("/cliente/5", client);
  });
});
