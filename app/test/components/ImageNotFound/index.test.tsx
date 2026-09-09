import { render } from "@testing-library/react";
import { ImageNotFound } from "../../../components/ImageNotFound/index";

describe("ImageNotFound", () => {
  it("renderiza o ícone com as classes padrão", () => {
    const { container } = render(<ImageNotFound />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("w-12", "h-12", "text-blue-300");
  });

  it("aceita classes extras via prop className", () => {
    const { container } = render(<ImageNotFound className="custom-class" />);
    expect(container.querySelector("svg")).toHaveClass("custom-class");
  });
});
