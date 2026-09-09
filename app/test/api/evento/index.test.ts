import api from "@/app/api";
import {
  deleteEventById,
  getAllEvents,
  postEvent,
  putEvent,
} from "@/app/api/evento";

jest.mock("@/app/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("@/app/api/evento", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllEvents busca todos os eventos", () => {
    getAllEvents();
    expect(api.get).toHaveBeenCalledWith("/eventos");
  });

  it("deleteEventById remove pelo id", () => {
    deleteEventById(1);
    expect(api.delete).toHaveBeenCalledWith("/eventos/1");
  });

  it("postEvent envia FormData com o content-type correto", () => {
    const form = new FormData();
    postEvent(form);
    expect(api.post).toHaveBeenCalledWith("/eventos", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  });

  it("putEvent atualiza um evento existente com FormData", () => {
    const form = new FormData();
    putEvent(1, form);
    expect(api.put).toHaveBeenCalledWith("/eventos/1", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  });
});
