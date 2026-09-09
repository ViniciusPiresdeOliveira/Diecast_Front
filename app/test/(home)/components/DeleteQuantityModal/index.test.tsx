import { DeleteQuantityModal } from "@/app/(home)/components/DeleteQuantityModal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const baseProps = {
  open: true,
  miniNome: "Ferrari F40",
  quantidadeEstoque: 10,
  quantidadeGaragem: 2,
  quantidadeDisponivel: 8,
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe("DeleteQuantityModal", () => {
  afterEach(() => jest.clearAllMocks());

  it("exibe o nome da miniatura no título", () => {
    render(<DeleteQuantityModal {...baseProps} />);
    expect(
      screen.getByText(/Excluir unidades da miniatura - Ferrari F40/),
    ).toBeInTheDocument();
  });

  it("exibe as quantidades em estoque, garagem e disponível", () => {
    render(<DeleteQuantityModal {...baseProps} />);
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("8")).toBeInTheDocument();
  });

  it("inicia com quantidade a excluir igual a 1", () => {
    render(<DeleteQuantityModal {...baseProps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("chama onConfirm com a quantidade selecionada ao clicar em Excluir", async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();

    render(<DeleteQuantityModal {...baseProps} onConfirm={onConfirm} />);

    const incrementButtons = screen.getAllByRole("button");
    const plusButton = incrementButtons.find((btn) =>
      btn.querySelector("svg.lucide-plus"),
    );
    if (plusButton) await user.click(plusButton);

    await user.click(screen.getByRole("button", { name: "Excluir" }));

    expect(onConfirm).toHaveBeenCalledWith(2);
  });

  it("chama onCancel ao clicar em Cancelar", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(<DeleteQuantityModal {...baseProps} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("reseta a quantidade para 1 quando reaberto", () => {
    const { rerender } = render(
      <DeleteQuantityModal {...baseProps} open={false} />,
    );
    rerender(<DeleteQuantityModal {...baseProps} open={true} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
