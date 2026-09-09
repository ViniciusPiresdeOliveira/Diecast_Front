import { MiniFormValues } from "@/app/(home)/components/ModalFormMini/validation";
import { buildMiniaturaFormData } from "@/app/api/miniatura/utils";

describe("api/miniatura/utils", () => {
  describe("buildMiniaturaFormData", () => {
    const baseMini = {
      name: "Ferrari F40",
      brand: "1",
      types: ["2"],
      condition: "3",
      year: 1990,
      scale: "1:18",
      line: "4",
      price: 15000,
      stockQty: 10,
      availableQty: 8,
      garageQty: 2,
      image: [],
    } as unknown as MiniFormValues;

    it("monta o payload mapeado corretamente", () => {
      const { payload } = buildMiniaturaFormData(baseMini);

      expect(payload).toMatchObject({
        nome: "Ferrari F40",
        marcaId: 1,
        valor: 150,
      });
    });

    it("adiciona o payload como Blob JSON no FormData", () => {
      const { formData } = buildMiniaturaFormData(baseMini);

      expect(formData.get("miniatura")).toBeInstanceOf(Blob);
      expect(formData.get("imagem")).toBeNull();
    });

    it("adiciona a imagem quando há originFileObj", () => {
      const file = new File(["conteudo"], "foto.png");
      const mini = {
        ...baseMini,
        image: [{ originFileObj: file }],
      } as unknown as MiniFormValues;

      const { formData } = buildMiniaturaFormData(mini);

      expect(formData.get("imagem")).toBe(file);
    });
  });
});
