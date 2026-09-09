import { Footer } from "@/app/components/Footer";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Footer", () => {
  it("exibe o endereço da loja física", () => {
    render(<Footer />);
    expect(screen.getByText(/Possuímos loja física/i)).toBeInTheDocument();
  });

  it("possui link para o grupo do WhatsApp", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /grupo exclusivo/i });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("chat.whatsapp.com"),
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("possui link para o canal do YouTube", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /Abrir canal no YouTube/i });
    expect(link).toHaveAttribute("href", "https://www.youtube.com/@rkmdiecast");
  });

  it("possui link para o Instagram", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /Abrir Instagram da loja/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.instagram.com/petropolisdiecast/",
    );
  });
});
