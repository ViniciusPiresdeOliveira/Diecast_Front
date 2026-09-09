import { QuantitySelector } from "@/app/components/QuantitySelector";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("QuantitySelector", () => {
  it("renderiza o valor atual", () => {
    render(<QuantitySelector value={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("chama onChange com valor incrementado ao clicar em +", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<QuantitySelector value={2} onChange={onChange} />);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("chama onChange com valor decrementado ao clicar em -", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<QuantitySelector value={2} onChange={onChange} min={0} />);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("desabilita o botão de decremento no valor mínimo", () => {
    render(<QuantitySelector value={0} min={0} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
  });

  it("desabilita o botão de incremento no valor máximo", () => {
    render(<QuantitySelector value={5} max={5} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toBeDisabled();
  });

  it("desabilita ambos os botões quando disabled é true", () => {
    render(<QuantitySelector value={2} disabled />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it("não chama onChange ao clicar em - quando já está no mínimo", async () => {
    const onChange = jest.fn();
    render(<QuantitySelector value={0} min={0} onChange={onChange} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
