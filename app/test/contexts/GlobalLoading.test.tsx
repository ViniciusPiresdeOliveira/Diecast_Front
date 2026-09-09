import { render, screen } from "@testing-library/react";
import { GlobalLoading } from "../../contexts/GlobalLoading";
import { useLoading } from "../../hooks/useLoading";

jest.mock("../../hooks/useLoading", () => ({ useLoading: jest.fn() }));
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(props as never)} />;
  },
}));

const mockedUseLoading = useLoading as jest.Mock;

describe("GlobalLoading", () => {
  it("renderiza o componente Loading, que fica oculto quando loading é false", () => {
    mockedUseLoading.mockReturnValue({ loading: false });
    const { container } = render(<GlobalLoading />);
    expect(container).toBeEmptyDOMElement();
  });

  it("exibe a logo quando loading é true", () => {
    mockedUseLoading.mockReturnValue({ loading: true });
    render(<GlobalLoading />);
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });
});
