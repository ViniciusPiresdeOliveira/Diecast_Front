import { GarageButton } from "@/app/components/Buttons/Garage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("GarageButton", () => {
  it("chama onClick ao ser clicado", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(<GarageButton onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("fica desabilitado quando disabled é true", () => {
    render(<GarageButton onClick={jest.fn()} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("não fica desabilitado por padrão", () => {
    render(<GarageButton onClick={jest.fn()} />);
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("aplica classes extras via prop className", () => {
    render(<GarageButton onClick={jest.fn()} className="custom" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("não é clicável quando desabilitado (variant table)", async () => {
    const onClick = jest.fn();
    render(<GarageButton onClick={onClick} variant="table" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
