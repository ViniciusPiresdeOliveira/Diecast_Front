import { Drawer } from "@/app/(home)/components/Drawer";
import { useFilterTrigger } from "@/app/hooks/useFilterTrigger";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/hooks/useFilterTrigger", () => ({
  useFilterTrigger: jest.fn(),
}));

jest.mock("@/app/(home)/components/Filter", () => ({
  Filter: ({
    handleFilterMiniaturas,
  }: {
    handleFilterMiniaturas: () => void;
  }) => <button onClick={handleFilterMiniaturas}>Aplicar filtro (mock)</button>,
}));

const mockedUseFilterTrigger = useFilterTrigger as jest.Mock;

describe("Drawer", () => {
  const triggerFilter = jest.fn();
  const handleVisibility = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseFilterTrigger.mockReturnValue({ triggerFilter });
  });

  it('exibe classes de "fechado" quando isVisible é false', () => {
    const { container } = render(
      <Drawer isVisible={false} handleVisibility={handleVisibility} />,
    );
    expect(container.firstChild).toHaveClass("opacity-0");
  });

  it('exibe classes de "aberto" quando isVisible é true', () => {
    const { container } = render(
      <Drawer isVisible={true} handleVisibility={handleVisibility} />,
    );
    expect(container.firstChild).toHaveClass("opacity-100");
  });

  it("chama handleVisibility ao clicar no overlay", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Drawer isVisible={true} handleVisibility={handleVisibility} />,
    );

    const overlay = container.querySelector(".bg-black\\/50");
    await user.click(overlay as Element);
    expect(handleVisibility).toHaveBeenCalledTimes(1);
  });

  it("chama handleVisibility ao clicar no botão de fechar (X)", async () => {
    const user = userEvent.setup();
    render(<Drawer isVisible={true} handleVisibility={handleVisibility} />);

    await user.click(screen.getByRole("button", { name: "" }));
    expect(handleVisibility).toHaveBeenCalledTimes(1);
  });

  it("dispara triggerFilter e fecha o drawer ao aplicar o filtro", async () => {
    const user = userEvent.setup();
    render(<Drawer isVisible={true} handleVisibility={handleVisibility} />);

    await user.click(screen.getByText("Aplicar filtro (mock)"));

    expect(triggerFilter).toHaveBeenCalledTimes(1);
    expect(handleVisibility).toHaveBeenCalledTimes(1);
  });
});
