import { getAllClientsByTerm } from "@/app/api/cliente";
import { Label } from "@/app/components/Label";
import { MessageError } from "@/app/components/MessageError";
import { QuantitySelector } from "@/app/components/QuantitySelector";
import { useLoading } from "@/app/hooks/useLoading";
import { getErrorMessage } from "@/app/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider, Modal, Select, Spin } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Cliente, ModalAddGaragemProps } from "./types";
import { defaultValuesForm, validateGarageQuantity } from "./utils";
import { GaragemFormValues, garagemSchema } from "./validation";
import { postMiniInGarage } from "@/app/api/garagem";

export const ModalSetGarage = ({
  visible,
  mini,
  handleVisibleModal,
  refreshList,
}: ModalAddGaragemProps) => {
  const { showLoading, hideLoading } = useLoading();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  const [clients, setClients] = useState<Cliente[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<GaragemFormValues>({
    resolver: yupResolver(garagemSchema),
    defaultValues: defaultValuesForm,
  });

  useEffect(() => {
    setIsModalOpen(visible);
    if (!visible) {
      reset(defaultValuesForm);
      setQuantityError(null);
      setClients([]);
    }
  }, [visible, reset]);

  const quantity = watch("quantity");

  useEffect(() => {
    if (!mini) return;
    setQuantityError(
      validateGarageQuantity({
        quantity,
        availableQty: mini.quantidadeDisponivel,
      }),
    );
  }, [quantity, mini]);

  const searchClients = useCallback((term: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!term) {
      setClients([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setLoadingClients(true);
      try {
        const response = await getAllClientsByTerm(term);
        // ajuste conforme o formato real de retorno da sua API (response.data ou response.data.data)
        const clientsData: Cliente[] =
          response.data?.data ?? response.data ?? [];
        setClients(clientsData);
      } catch (e) {
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    }, 400);
  }, []);

  const classNameContainerInputs = "flex-col mb-2";
  const hasErrorInForm = Object.keys(errors).length > 0;

  const handleCancel = () => {
    handleVisibleModal();
    reset(defaultValuesForm);
  };

  const handleAddToGarage = async (formValues: GaragemFormValues) => {
    if (!mini) return;
    showLoading();
    try {
      await postMiniInGarage({
        miniaturaId: mini.id,
        clienteId: Number(formValues.clientId),
        quantidade: formValues.quantity,
      });
      refreshList?.();
      toast.success(`${mini.nome} adicionada à garagem com sucesso`);
      reset(defaultValuesForm);
      handleVisibleModal();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal
      title="Adicionar à Garagem"
      open={isModalOpen}
      onOk={handleSubmit(handleAddToGarage)}
      okButtonProps={{
        disabled: hasErrorInForm || !isDirty || quantityError !== null,
      }}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
      width={"50%"}
    >
      <Divider />

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="flex flex-col">
          <div className="h-[22px] flex items-start">
            <Label text="Qtd Estoque" />
          </div>
          <QuantitySelector
            value={mini?.quantidadeEstoque ?? 0}
            onChange={() => {}}
            min={0}
            disabled
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-[22px] flex items-start">
            <Label text="Qtd Disponível" />
          </div>
          <QuantitySelector
            value={mini?.quantidadeDisponivel ?? 0}
            onChange={() => {}}
            min={0}
            disabled
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-[22px] flex items-start">
            <Label text="Qtd Garagem" />
          </div>
          <QuantitySelector
            value={mini?.quantidadeEmGaragem ?? 0}
            onChange={() => {}}
            min={0}
            disabled
          />
        </div>
      </div>

      <Controller
        name="clientId"
        control={control}
        render={({ field }) => (
          <div className={classNameContainerInputs}>
            <Label text="Cliente" required />
            <Select
              {...field}
              showSearch
              filterOption={false}
              allowClear
              placeholder="Digite o nome do cliente"
              onSearch={searchClients}
              onChange={field.onChange}
              status={errors.clientId ? "error" : ""}
              notFoundContent={loadingClients ? <Spin size="small" /> : null}
              options={clients.map((client) => ({
                label: `${client.nome} - ${client.telefone}`,
                value: String(client.id),
              }))}
              style={{ width: "100%" }}
            />
            {errors.clientId && (
              <MessageError message={errors.clientId.message as string} />
            )}
          </div>
        )}
      />

      <Controller
        name="quantity"
        control={control}
        render={({ field }) => (
          <div className={classNameContainerInputs}>
            <Label text="Qtd a Adicionar" required />
            <QuantitySelector
              value={field.value}
              onChange={field.onChange}
              min={1}
              max={mini?.quantidadeDisponivel}
            />
            {errors.quantity && (
              <MessageError message={errors.quantity.message as string} />
            )}
            {quantityError && <MessageError message={quantityError} />}
          </div>
        )}
      />
    </Modal>
  );
};
