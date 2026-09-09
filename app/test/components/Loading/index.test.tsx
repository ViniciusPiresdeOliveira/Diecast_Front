import { Loading } from "@/app/components/Loading";
import { useLoading } from "@/app/hooks/useLoading";
import { render, screen } from "@testing-library/react";

jest.mock("@/app/hooks/useLoading", () => ({
  useLoading: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(props as never)} />;
  },
}));

const mockedUseLoading = useLoading as jest.Mock;

describe("Loading", () => {
  it("não renderiza nada quando loading é false", () => {
    mockedUseLoading.mockReturnValue({ loading: false });
    const { container } = render(<Loading />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza o overlay com a logo quando loading é true", () => {
    mockedUseLoading.mockReturnValue({ loading: true });
    render(<Loading />);
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });
});
