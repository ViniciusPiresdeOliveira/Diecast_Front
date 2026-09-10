import { ModalPhoto } from "@/app/(home)/components/ModalPhoto";
import { Miniatura } from "@/app/(home)/types";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mini: Miniatura = {
  id: 1,
  nome: "Ferrari F40",
  marca: { id: 1, nome: "Hot Wheels" },
  tipos: [],
  condicao: { id: 1, nome: "Nova" },
  ano: 1990,
  escala: { id: 1, nome: "1:18" },
  linha: { id: 1, nome: "Premium" },
  valor: 100,
  quantidadeDisponivel: 5,
  quantidadeEmGaragem: 0,
  quantidadeEstoque: 5,
  imagem: "base64fakeimage",
};

describe("ModalPhoto", () => {
  const handleSelectedMini = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it("exibe a imagem formatada da miniatura selecionada", () => {
    render(
      <ModalPhoto
        selectedMini={mini}
        handleSelectedMini={handleSelectedMini}
      />,
    );

    const img = document.querySelector(
      ".ant-image-preview-img",
    ) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("data:image/jpeg;base64,base64fakeimage");
  });

  it("não define src quando não há miniatura selecionada", () => {
    render(
      <ModalPhoto
        selectedMini={null}
        handleSelectedMini={handleSelectedMini}
      />,
    );

    const img = document.querySelector(
      ".ant-image-preview-img",
    ) as HTMLImageElement;
    expect(img.getAttribute("src")).toBeFalsy();
  });

  it("abre o preview automaticamente (open: true)", () => {
    render(
      <ModalPhoto
        selectedMini={mini}
        handleSelectedMini={handleSelectedMini}
      />,
    );

    expect(
      document.querySelector(".ant-image-preview-img"),
    ).toBeInTheDocument();
  });

  it("chama handleSelectedMini(null) ao fechar o preview", async () => {
    const user = userEvent.setup();
    render(
      <ModalPhoto
        selectedMini={mini}
        handleSelectedMini={handleSelectedMini}
      />,
    );

    const closeButton = document.querySelector(
      ".ant-image-preview-mask",
    ) as Element;
    await user.click(closeButton);

    await waitFor(() => expect(handleSelectedMini).toHaveBeenCalledWith(null));
  });
});
