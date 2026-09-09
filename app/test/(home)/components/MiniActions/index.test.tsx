import { MiniActions } from "@/app/(home)/components/MiniActions";
import { Miniatura } from "@/app/(home)/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/components/Modal/Delete", () => ({
  DeleteConfirmModal: ({ open, title }: { open: boolean; title: string }) =>
    open ? <div data-testid="delete-modal">{title}</div> : null,
}));
jest.mock("@/app/components/ModalSetGarage", () => ({
  ModalSetGarage: ({ visible }: { visible: boolean }) =>
    visible ? <div data-testid="garage-modal" /> : null,
}));
jest.mock("@/app/(home)/components/DeleteQuantityModal", () => ({
  DeleteQuantityModal: ({ open }: { open: boolean }) =>
    open ? <div data-testid="delete-quantity-modal" /> : null,
}));

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
};

describe("MiniActions", () => {
  const handleSelectedMini = jest.fn();
  const handleVisibleFormMini = jest.fn();
  const handleDeleteMiniById = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it("chama handleSelectedMini e handleVisibleFormMini('edit') ao editar", async () => {
    const user = userEvent.setup();
    render(
      <MiniActions
        mini={mini}
        handleSelectedMini={handleSelectedMini}
        handleVisibleFormMini={handleVisibleFormMini}
        handleDeleteMiniById={handleDeleteMiniById}
      />,
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]); // edit

    expect(handleSelectedMini).toHaveBeenCalledWith(mini);
    expect(handleVisibleFormMini).toHaveBeenCalledWith("edit");
  });

  it("abre o modal de exclusão simples quando há apenas 1 unidade em estoque", async () => {
    const user = userEvent.setup();
    render(
      <MiniActions
        mini={{ ...mini, quantidadeEstoque: 1 }}
        handleSelectedMini={handleSelectedMini}
        handleVisibleFormMini={handleVisibleFormMini}
        handleDeleteMiniById={handleDeleteMiniById}
      />,
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[buttons.length - 1]); // delete (último botão em variant card)

    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    expect(
      screen.queryByTestId("delete-quantity-modal"),
    ).not.toBeInTheDocument();
  });

  it("abre o modal de exclusão por quantidade quando há mais de 1 unidade em estoque", async () => {
    const user = userEvent.setup();
    render(
      <MiniActions
        mini={{ ...mini, quantidadeEstoque: 5 }}
        handleSelectedMini={handleSelectedMini}
        handleVisibleFormMini={handleVisibleFormMini}
        handleDeleteMiniById={handleDeleteMiniById}
      />,
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[buttons.length - 1]);

    expect(screen.getByTestId("delete-quantity-modal")).toBeInTheDocument();
  });

  it("desabilita o botão de garagem quando não há unidades disponíveis", () => {
    render(
      <MiniActions
        mini={{ ...mini, quantidadeDisponivel: 0 }}
        handleSelectedMini={handleSelectedMini}
        handleVisibleFormMini={handleVisibleFormMini}
        handleDeleteMiniById={handleDeleteMiniById}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toBeDisabled(); // garage button
  });

  it("renderiza variante table com botão de visualizar imagem", () => {
    render(
      <MiniActions
        mini={mini}
        handleSelectedMini={handleSelectedMini}
        handleVisibleFormMini={handleVisibleFormMini}
        handleDeleteMiniById={handleDeleteMiniById}
        variant="table"
      />,
    );

    // edit, garage, view (eye), delete = 4 botões
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });
});
