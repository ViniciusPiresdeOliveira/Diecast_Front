import { getLabelClassName } from "@/app/(home)/components/Filter/utils";

describe("Filter/utils - getLabelClassName", () => {
  it('retorna "text-white" quando visível', () => {
    expect(getLabelClassName(true)).toBe("text-white");
  });

  it('retorna "text-black" quando não visível', () => {
    expect(getLabelClassName(false)).toBe("text-black");
  });
});
