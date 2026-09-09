import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteButton } from "../../../../components/Buttons/Delete/index";

describe("DeleteButton", () => {
  it("chama onClick ao ser clicado (variant card)", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(<DeleteButton onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("aplica classes de visibilidade sempre visível quando isMobile", () => {
    const { rerender } = render(<DeleteButton onClick={jest.fn()} isMobile />);
    expect(screen.getByRole("button")).toHaveClass("opacity-100");

    rerender(<DeleteButton onClick={jest.fn()} isMobile={false} />);
    expect(screen.getByRole("button")).toHaveClass("opacity-0");
  });

  it("aplica classes extras via prop className", () => {
    render(<DeleteButton onClick={jest.fn()} className="custom" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("renderiza sem classes de posicionamento absoluto quando variant é table", () => {
    render(<DeleteButton onClick={jest.fn()} variant="table" />);
    expect(screen.getByRole("button")).not.toHaveClass("absolute");
  });
});
