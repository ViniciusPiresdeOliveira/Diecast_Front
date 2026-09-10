import { OptionsOfNavigate } from "@/app/components/Header/utils";
import { render, screen } from "@testing-library/react";
import { Grid } from "antd";

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    Grid: { useBreakpoint: jest.fn() },
  };
});

const mockedUseBreakpoint = Grid.useBreakpoint as jest.Mock;

describe("Header/utils (OptionsOfNavigate)", () => {
  it("exibe os links de navegação diretamente em telas desktop (md true)", () => {
    mockedUseBreakpoint.mockReturnValue({ md: true });
    render(<OptionsOfNavigate isAdmin={false} />);

    expect(screen.getByRole("link", { name: "Afiliado" })).toHaveAttribute(
      "href",
      "/afiliado",
    );
    expect(screen.getByRole("link", { name: "Eventos" })).toHaveAttribute(
      "href",
      "/eventos",
    );
    expect(
      screen.queryByRole("link", { name: "Clientes" }),
    ).not.toBeInTheDocument();
  });

  it("exibe o link de Clientes quando isAdmin é true no desktop", () => {
    mockedUseBreakpoint.mockReturnValue({ md: true });
    render(<OptionsOfNavigate isAdmin />);

    expect(screen.getByRole("link", { name: "Clientes" })).toHaveAttribute(
      "href",
      "/clientes",
    );
  });

  it("exibe um dropdown (botão) em telas mobile (md false)", () => {
    mockedUseBreakpoint.mockReturnValue({ md: false });
    render(<OptionsOfNavigate isAdmin={false} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
