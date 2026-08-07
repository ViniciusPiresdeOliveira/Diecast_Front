import { postClient, putClient } from "@/app/api/cliente";
import { fetchAddressByCep } from "@/app/api/viacep";
import { ViaCepResponse } from "@/app/api/viacep/types";
import { Label } from "@/app/components/Label";
import { MessageError } from "@/app/components/MessageError";
import { useLoading } from "@/app/hooks/useLoading";
import { getErrorMessage } from "@/app/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ModalFormClienteProps } from "./types";
import {
  defaultValuesForm,
  maskCep,
  maskTelefone,
  unmaskClienteForm,
} from "./utils";
import { ClienteFormValues, clienteSchema } from "./validation";

export const ModalFormCliente = ({
  visible,
  cliente,
  handleVisibleFormCliente,
  type,
  refreshClienteList,
}: ModalFormClienteProps) => {
  const { showLoading, hideLoading } = useLoading();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressInfo, setAddressInfo] = useState<ViaCepResponse | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ClienteFormValues>({
    resolver: yupResolver(clienteSchema),
    defaultValues: defaultValuesForm,
  });

  const classNameContainerInputs = "flex-col mb-2";
  const hasErrorInForm = Object.keys(errors).length > 0;

  const cepValue = watch("cep");

  const handleCancel = () => {
    handleVisibleFormCliente(type);
    reset();
  };

  const handleRegisterCliente = async (clienteForm: ClienteFormValues) => {
    showLoading();

    const payload = unmaskClienteForm(clienteForm);

    try {
      if (cliente) {
        await putClient(payload, cliente.id);
      } else {
        await postClient(payload);
      }
      refreshClienteList();
      const messageSuccess = `${clienteForm.nome} ${
        cliente ? "atualizado" : "cadastrado"
      } com sucesso`;
      toast.success(messageSuccess);
      reset();
      handleVisibleFormCliente(type);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      hideLoading();
    }
  };

  // Busca endereço no ViaCEP sempre que o cep tiver 8 dígitos
  useEffect(() => {
    showLoading();
    const digits = (cepValue ?? "").replace(/\D/g, "");

    if (digits.length !== 8) {
      setAddressInfo(null);
      return;
    }

    let cancelled = false;

    const search = async () => {
      setIsLoadingCep(true);
      const result = await fetchAddressByCep(digits);
      if (!cancelled) {
        setAddressInfo(result);
        setIsLoadingCep(false);
      }
    };

    search();
    hideLoading();
    return () => {
      cancelled = true;
    };
  }, [cepValue]);

  useEffect(() => {
    setIsModalOpen(visible);
    if (!visible) {
      reset(defaultValuesForm);
    }
  }, [visible, cliente, type, reset]);

  useEffect(() => {
    if (!cliente) {
      reset(defaultValuesForm);
      return;
    }
    reset({
      nome: cliente.nome,
      telefone: maskTelefone(cliente.telefone ?? ""),
      cep: maskCep(cliente.cep ?? ""),
      numeroResidencia: cliente.numeroResidencia ?? "",
    });
  }, [cliente, reset]);

  return (
    <Modal
      title={type === "add" ? "Criar Cliente" : "Editar Cliente"}
      open={isModalOpen}
      onOk={handleSubmit(handleRegisterCliente)}
      okButtonProps={{ disabled: hasErrorInForm || !isDirty }}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
      width={"50%"}
    >
      <Divider />

      <Controller
        name="nome"
        control={control}
        render={({ field }) => (
          <div className={classNameContainerInputs}>
            <Label text="Nome" required />
            <Input {...field} status={errors.nome ? "error" : ""} />
            {errors.nome && (
              <MessageError message={errors.nome.message as string} />
            )}
          </div>
        )}
      />

      <Controller
        name="telefone"
        control={control}
        render={({ field }) => (
          <div className={classNameContainerInputs}>
            <Label text="Telefone" required />
            <Input
              {...field}
              value={field.value}
              onChange={(e) => field.onChange(maskTelefone(e.target.value))}
              status={errors.telefone ? "error" : ""}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
            {errors.telefone && (
              <MessageError message={errors.telefone.message as string} />
            )}
          </div>
        )}
      />

      <div className="flex gap-3">
        <Controller
          name="cep"
          control={control}
          render={({ field }) => (
            <div className={classNameContainerInputs + " flex-1"}>
              <Label text="Cep" />
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(maskCep(e.target.value))}
                status={errors.cep ? "error" : ""}
                placeholder="00000-000"
                maxLength={9}
              />
              {errors.cep && (
                <MessageError message={errors.cep.message as string} />
              )}
            </div>
          )}
        />

        <Controller
          name="numeroResidencia"
          control={control}
          render={({ field }) => (
            <div className={classNameContainerInputs + " flex-1"}>
              <Label text="Número Residência" />
              <Input
                {...field}
                value={field.value ?? ""}
                status={errors.numeroResidencia ? "error" : ""}
              />
              {errors.numeroResidencia && (
                <MessageError
                  message={errors.numeroResidencia.message as string}
                />
              )}
            </div>
          )}
        />
      </div>

      {/* Campos somente leitura, não fazem parte do form/schema */}
      {addressInfo && (
        <div className="flex flex-col gap-2 mt-4 p-3 bg-zinc-50 rounded-md border border-zinc-200">
          <span className="text-sm font-semibold text-zinc-500">
            Endereço encontrado
          </span>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label text="Logradouro" />
              <Input value={addressInfo.logradouro ?? ""} disabled />
            </div>
            <div className="flex-1">
              <Label text="Bairro" />
              <Input value={addressInfo.bairro ?? ""} disabled />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label text="Cidade" />
              <Input value={addressInfo.localidade ?? ""} disabled />
            </div>
            <div className="flex-1">
              <Label text="UF" />
              <Input value={addressInfo.uf ?? ""} disabled />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
