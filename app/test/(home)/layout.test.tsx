import HomeLayout from "@/app/(home)/layout";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/components/Footer", () => ({
  Footer: () => <div data-testid="footer" />,
}));
jest.mock("@/app/components/Header", () => ({
  Header: ({ handleVisibilityMenu }: { handleVisibilityMenu: () => void }) => (
    <button data-testid="header" onClick={handleVisibilityMenu}>
      header
    </button>
  ),
}));
jest.mock("@/app/(home)/components/Drawer", () => ({
  Drawer: ({ isVisible }: { isVisible: boolean }) => (
    <div data-testid="drawer">{isVisible ? "aberto" : "fechado"}</div>
  ),
}));

describe("HomeLayout", () => {
  it("renderiza Header, Drawer, Footer e o conteúdo filho", () => {
    render(
      <HomeLayout>
        <p>Conteúdo da página</p>
      </HomeLayout>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("drawer")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo da página")).toBeInTheDocument();
  });

  it("o Drawer inicia fechado", () => {
    render(
      <HomeLayout>
        <p>Conteúdo</p>
      </HomeLayout>,
    );

    expect(screen.getByTestId("drawer")).toHaveTextContent("fechado");
  });

  it("alterna a visibilidade do Drawer ao acionar handleVisibilityMenu", async () => {
    const user = userEvent.setup();
    render(
      <HomeLayout>
        <p>Conteúdo</p>
      </HomeLayout>,
    );

    await user.click(screen.getByTestId("header"));
    expect(screen.getByTestId("drawer")).toHaveTextContent("aberto");

    await user.click(screen.getByTestId("header"));
    expect(screen.getByTestId("drawer")).toHaveTextContent("fechado");
  });
});
