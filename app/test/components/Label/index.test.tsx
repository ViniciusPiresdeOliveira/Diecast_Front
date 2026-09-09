import { Label } from "@/app/components/Label";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/components/ModalAddItens", () => ({
  ModalAddItens: ({ title }: { title: string }) => (
    <div data-testid="modal-add-itens">{title}</div>
  ),
}));

describe("Label", () => {
  it("renderiza o texto informado", () => {
    render(<Label text="Marca" />);
    expect(screen.getByText("Marca")).toBeInTheDocument();
  });

  it('exibe "*" quando required é true', () => {
    render(<Label text="Marca" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("não exibe o botão de adicionar quando iconAdd não é informado", () => {
    render(<Label text="Marca" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("exibe o botão de adicionar quando iconAdd é informado", () => {
    render(<Label text="Marca" iconAdd="marca" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("abre o modal de adicionar item ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<Label text="Marca" iconAdd="marca" />);

    expect(screen.queryByTestId("modal-add-itens")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button"));
    expect(screen.getByTestId("modal-add-itens")).toBeInTheDocument();
  });

  it("fecha o modal ao clicar novamente no botão (toggle)", async () => {
    const user = userEvent.setup();
    render(<Label text="Marca" iconAdd="marca" />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByTestId("modal-add-itens")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));
    expect(screen.queryByTestId("modal-add-itens")).not.toBeInTheDocument();
  });
});
