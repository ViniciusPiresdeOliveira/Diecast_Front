import { ClientActions } from "@/app/(home)/clientes/components/ClientActions";
import { Cliente } from "@/app/api/cliente/types";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const cliente: Cliente = {
  id: 1,
  nome: "João",
  telefone: "21999999999",
};

describe("ClientActions", () => {
  const handleSelectedClient = jest.fn();
  const handleVisibleFormClient = jest.fn();
  const handleDeleteClientById = jest.fn();
  const handleOpenGaragem = jest.fn();

  afterEach(() => jest.clearAllMocks());

  const setup = () =>
    render(
      <ClientActions
        cliente={cliente}
        handleSelectedClient={handleSelectedClient}
        handleVisibleFormClient={handleVisibleFormClient}
        handleDeleteClientById={handleDeleteClientById}
        handleOpenGaragem={handleOpenGaragem}
      />,
    );

  it("chama handleSelectedClient e handleVisibleFormClient('edit') ao clicar em editar", async () => {
    const user = userEvent.setup();
    setup();

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]); // edit

    expect(handleSelectedClient).toHaveBeenCalledWith(cliente);
    expect(handleVisibleFormClient).toHaveBeenCalledWith("edit");
  });

  it("chama handleSelectedClient e handleOpenGaragem ao clicar no botão de garagem", async () => {
    const user = userEvent.setup();
    setup();

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]); // garagem

    expect(handleSelectedClient).toHaveBeenCalledWith(cliente);
    expect(handleOpenGaragem).toHaveBeenCalledWith(cliente);
  });

  it("abre o modal de confirmação ao clicar em excluir", async () => {
    const user = userEvent.setup();
    setup();

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[2]); // delete

    expect(screen.getByText("Excluir cliente")).toBeInTheDocument();
    expect(screen.getByText("João")).toBeInTheDocument();
  });

  it("chama handleDeleteClientById e fecha o modal ao confirmar exclusão com sucesso", async () => {
    handleDeleteClientById.mockResolvedValueOnce(true);
    const user = userEvent.setup();
    setup();

    await user.click(screen.getAllByRole("button")[2]);
    await user.click(screen.getByRole("button", { name: "Excluir" }));

    expect(handleDeleteClientById).toHaveBeenCalledWith(cliente);
    await waitFor(() =>
      expect(
        screen.getByText("Excluir cliente").closest(".ant-modal"),
      ).not.toBeVisible(),
    );
  });

  it("mantém o modal aberto quando a exclusão falha", async () => {
    handleDeleteClientById.mockResolvedValueOnce(false);
    const user = userEvent.setup();
    setup();

    await user.click(screen.getAllByRole("button")[2]);
    await user.click(screen.getByRole("button", { name: "Excluir" }));

    expect(await screen.findByText("Excluir cliente")).toBeInTheDocument();
  });
});
