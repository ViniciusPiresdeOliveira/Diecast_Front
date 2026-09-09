import { DeleteConfirmModal } from "@/app/components/Modal/Delete";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("DeleteConfirmModal", () => {
  it("não renderiza o conteúdo quando open é false", () => {
    render(
      <DeleteConfirmModal
        open={false}
        title="Excluir"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    expect(screen.queryByText("Excluir")).not.toBeInTheDocument();
  });

  it("renderiza título, mensagem e nome específico quando open", () => {
    render(
      <DeleteConfirmModal
        open
        title="Excluir miniatura"
        message="Tem certeza que deseja excluir "
        nameSpecific="Ferrari F40"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.getByText("Excluir miniatura")).toBeInTheDocument();
    expect(
      screen.getByText(/Tem certeza que deseja excluir/),
    ).toBeInTheDocument();
    expect(screen.getByText("Ferrari F40")).toBeInTheDocument();
  });

  it("chama onConfirm ao clicar no botão de confirmar (texto customizado)", async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();

    render(
      <DeleteConfirmModal
        open
        title="Excluir"
        confirmText="Excluir"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Excluir" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("chama onCancel ao clicar em cancelar", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(
      <DeleteConfirmModal
        open
        title="Excluir"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renderiza children customizados no lugar da mensagem padrão", () => {
    render(
      <DeleteConfirmModal
        open
        title="Excluir"
        message="não deveria aparecer"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      >
        <p>Conteúdo customizado</p>
      </DeleteConfirmModal>,
    );

    expect(screen.getByText("Conteúdo customizado")).toBeInTheDocument();
    expect(screen.queryByText("não deveria aparecer")).not.toBeInTheDocument();
  });
});
