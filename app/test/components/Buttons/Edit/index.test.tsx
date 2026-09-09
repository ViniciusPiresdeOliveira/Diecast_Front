import { EditButton } from "@/app/components/Buttons/Edit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("EditButton", () => {
  it("chama onClick ao ser clicado", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(<EditButton onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("não aplica classes de posicionamento absoluto quando variant é table", () => {
    render(<EditButton onClick={jest.fn()} variant="table" />);
    expect(screen.getByRole("button")).not.toHaveClass("absolute");
  });

  it("aplica classes de visibilidade condicional quando variant é card", () => {
    render(<EditButton onClick={jest.fn()} variant="card" isMobile={false} />);
    expect(screen.getByRole("button")).toHaveClass("opacity-0");
  });

  it("mantém visível quando isMobile é true", () => {
    render(<EditButton onClick={jest.fn()} variant="card" isMobile />);
    expect(screen.getByRole("button")).toHaveClass("opacity-100");
  });
});
