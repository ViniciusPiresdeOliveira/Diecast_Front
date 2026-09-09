import { MessageError } from "@/app/components/MessageError";
import { render, screen } from "@testing-library/react";

describe("MessageError", () => {
  it("renderiza a mensagem informada", () => {
    render(<MessageError message="Campo obrigatório" />);
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
  });

  it("aplica a classe de cor de erro", () => {
    render(<MessageError message="Erro" />);
    expect(screen.getByText("Erro")).toHaveClass("text-red-primary");
  });
});
