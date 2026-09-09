import { formatListPTBR, optionsCarousel } from "@/app/(home)/mini/[id]/utils";

describe("mini/[id]/utils", () => {
  describe("optionsCarousel", () => {
    it("possui a configuração esperada para o Splide", () => {
      expect(optionsCarousel).toMatchObject({
        type: "slide",
        perPage: 4,
        perMove: 1,
        arrows: true,
        pagination: false,
        autoplay: true,
      });
      expect(optionsCarousel.breakpoints).toEqual({
        1024: { perPage: 3 },
        640: { perPage: 2 },
        435: { perPage: 1 },
      });
    });
  });

  describe("formatListPTBR", () => {
    it("retorna string vazia quando não há itens", () => {
      expect(formatListPTBR(undefined)).toBe("");
      expect(formatListPTBR([])).toBe("");
    });

    it("retorna o próprio nome quando há apenas um item", () => {
      expect(formatListPTBR([{ nome: "Hot Wheels" }])).toBe("Hot Wheels");
    });

    it('junta dois itens com "e" quando há exatamente dois', () => {
      expect(
        formatListPTBR([{ nome: "Hot Wheels" }, { nome: "Matchbox" }]),
      ).toBe("Hot Wheels e Matchbox");
    });

    it('junta o último item com "e" e os demais com vírgula quando há três ou mais', () => {
      expect(
        formatListPTBR([
          { nome: "Hot Wheels" },
          { nome: "Matchbox" },
          { nome: "Majorette" },
        ]),
      ).toBe("Hot Wheels, Matchbox e Majorette");
    });

    it("não muta o array original de itens", () => {
      const items = [{ nome: "A" }, { nome: "B" }, { nome: "C" }];
      formatListPTBR(items);
      expect(items).toHaveLength(3);
    });
  });
});
