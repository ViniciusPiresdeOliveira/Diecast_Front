import {
  buildEventoFormData,
  mapEventoPayload,
} from "@/app/(home)/eventos/components/ModalFormEvento/utils";
import { EventoFormValues } from "@/app/(home)/eventos/components/ModalFormEvento/validation";

describe("ModalFormEvento/utils", () => {
  describe("mapEventoPayload", () => {
    it("mapeia os campos do evento para o payload da API", () => {
      const evento = {
        titulo: "Encontro de Colecionadores",
        descricao: "Descrição do evento",
        data: "2024-05-10",
        imagens: [],
      } as unknown as EventoFormValues;

      expect(mapEventoPayload(evento)).toEqual({
        titulo: "Encontro de Colecionadores",
        descricao: "Descrição do evento",
        dataEvento: "2024-05-10",
      });
    });

    it("usa string vazia quando a descrição não é informada", () => {
      const evento = {
        titulo: "Encontro",
        descricao: undefined,
        data: "2024-05-10",
        imagens: [],
      } as unknown as EventoFormValues;

      expect(mapEventoPayload(evento).descricao).toBe("");
    });
  });

  describe("buildEventoFormData", () => {
    it("monta o FormData com o payload e sem imagens quando não há arquivos", async () => {
      const evento = {
        titulo: "Encontro",
        descricao: "Desc",
        data: "2024-05-10",
        imagens: [],
      } as unknown as EventoFormValues;

      const { formData, payload } = buildEventoFormData(evento);

      expect(payload).toEqual({
        titulo: "Encontro",
        descricao: "Desc",
        dataEvento: "2024-05-10",
      });
      expect(formData.get("evento")).toBeInstanceOf(Blob);
      expect(formData.getAll("imagens")).toHaveLength(0);
    });

    it("inclui somente arquivos com originFileObj definido", () => {
      const fileA = new File(["a"], "a.png");
      const evento = {
        titulo: "Encontro",
        descricao: "Desc",
        data: "2024-05-10",
        imagens: [{ originFileObj: fileA }, { originFileObj: undefined }],
      } as unknown as EventoFormValues;

      const { formData } = buildEventoFormData(evento);

      expect(formData.getAll("imagens")).toHaveLength(1);
      expect(formData.getAll("imagens")[0]).toBe(fileA);
    });
  });
});
