import { postMiniatura, putMiniatura } from "@/app/api/miniatura";
import { Label } from "@/app/components/Label";
import { MessageError } from "@/app/components/MessageError";
import { QuantitySelector } from "@/app/components/QuantitySelector";
import { useFilterLists } from "@/app/hooks/useFilterLists";
import { useLoading } from "@/app/hooks/useLoading";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { getErrorMessage } from "@/app/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Divider,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatImage } from "../../utils";
import { ModalFormMiniProps } from "./types";
import { defaultValuesForm, validateQuantities } from "./utils";
import { MiniFormValues, miniSchema } from "./validation";

export const ModalFormMini = ({
  visible,
  mini,
  handleVisibleFormMini,
  type,
  refreshMiniList,
}: ModalFormMiniProps) => {
  const { isMobile } = useTypeDevice();
  const { showLoading, hideLoading } = useLoading();
  const { filterLists } = useFilterLists();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(miniSchema),
    defaultValues: {
      ...defaultValuesForm,
      stockQty: 1,
      availableQty: 1,
      garageQty: 0,
    },
  });

  const handleCancel = () => {
    handleVisibleFormMini(type);
    reset();
  };

  const handleRegisterMini = async (miniForm: MiniFormValues) => {
    showLoading();
    try {
      if (mini) {
        await putMiniatura(miniForm, mini?.id);
      } else {
        await postMiniatura(miniForm);
      }
      refreshMiniList();
      const messageSuccess = `${miniForm.name} ${mini ? "atualizado" : "cadastrado"} com sucesso`;
      toast.success(messageSuccess);
      reset();
      handleVisibleFormMini(type);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    setIsModalOpen(visible);
    if (!visible) {
      reset(defaultValuesForm);
    }
  }, [visible, mini, type, reset]);

  useEffect(() => {
    if (!mini) {
      reset(defaultValuesForm);
      return;
    }
    reset({
      name: mini.nome,
      year: mini.ano,
      price: Math.round(mini.valor * 100), // converte pra centavos
      stockQty: mini.quantidadeEstoque, // se tiver no objeto real
      availableQty: mini.quantidadeDisponivel, // se tiver no objeto real
      garageQty: mini.quantidadeEmGaragem, // se tiver no objeto real
      brand: String(mini.marca?.id),
      types: mini.tipos?.map((t) => String(t.id)) || [],
      line: String(mini.linha?.id),
      condition: String(mini.condicao.id),
      scale: String(mini.escala?.id),
      image: mini.imagem
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: formatImage(mini.imagem),
            },
          ]
        : [],
    });
  }, [mini, reset]);

  const classNameContainerInputs = "flex-col mb-2";
  const hasErrorInForm = Object.keys(errors).length > 0;

  const stockQty = watch("stockQty");
  const availableQty = watch("availableQty");
  const garageQty = watch("garageQty");

  const [quantityError, setQuantityError] = useState<string | null>(null);

  useEffect(() => {
    if (!mini) {
      setValue("availableQty", stockQty);
    }
    if (mini && stockQty !== mini.quantidadeEstoque) {
      setValue("availableQty", stockQty - garageQty);
    }
  }, [stockQty]);

  useEffect(() => {
    setQuantityError(
      validateQuantities({
        stockQty,
        availableQty,
        garageQty,
      }),
    );
  }, [availableQty]);
  console.log("quantityError", quantityError);

  return (
    <Modal
      title={type === "add" ? "Criar Miniatura" : "Editar Miniatura"}
      open={isModalOpen}
      onOk={handleSubmit(handleRegisterMini)}
      okButtonProps={{
        disabled: hasErrorInForm || !isDirty || quantityError !== null,
      }}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
      width={"70%"}
    >
      <Divider />
      <div className="md:flex -sm:flex-col justify-between">
        <div className="md:w-[47%] -sm:w-full">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Nome" required />
                <Input
                  {...field}
                  // placeholder="Nome"
                  status={errors.name ? "error" : ""}
                />
                {errors.name && (
                  <MessageError message={errors.name.message as string} />
                )}
              </div>
            )}
          />

          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Ano" required />
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  status={errors.year ? "error" : ""}
                  // placeholder="Ano"
                  min={0}
                  type="number"
                />

                {errors.year && (
                  <MessageError message={errors.year.message as string} />
                )}
              </div>
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => {
              const formatCurrency = (value: number) => {
                return (value / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
              };

              const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                const numericValue = Number(onlyNumbers);

                field.onChange(numericValue); // salva em centavos
              };

              return (
                <div className={classNameContainerInputs}>
                  <Label text="Preço" required />

                  <Input
                    value={formatCurrency(field.value || 0)}
                    onChange={handleChange}
                    status={errors.price ? "error" : ""}
                    inputMode="numeric"
                  />

                  {errors.price && (
                    <MessageError message={errors.price.message as string} />
                  )}
                </div>
              );
            }}
          />

          <div className="mb-2">
            {/* LINHA DOS INPUTS */}
            <div className="-xl:flex-col xl:flex gap-3 items-start">
              {/* Qtd Estoque */}
              <Controller
                name="stockQty"
                control={control}
                render={({ field }) => (
                  <div className="flex-1 flex flex-col">
                    <div className="h-[22px] flex items-start">
                      <Label text="Qtd Estoque" required />
                    </div>

                    <QuantitySelector
                      value={field.value}
                      onChange={field.onChange}
                      min={
                        mini
                          ? mini.quantidadeEmGaragem > 0
                            ? mini.quantidadeEmGaragem
                            : 1
                          : 1
                      }
                    />

                    {errors.stockQty && (
                      <MessageError
                        message={errors.stockQty.message as string}
                      />
                    )}
                  </div>
                )}
              />

              {/* Qtd Disponível */}
              {mini && (
                <>
                  <Controller
                    name="availableQty"
                    control={control}
                    render={({ field }) => (
                      <div className="flex-1 flex flex-col">
                        <div className="h-[22px] flex items-start">
                          <Label text="Qtd Disponível" required />
                        </div>

                        <QuantitySelector
                          value={field.value}
                          onChange={field.onChange}
                          min={0}
                          disabled
                        />

                        {errors.availableQty && (
                          <MessageError
                            message={errors.availableQty.message as string}
                          />
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="garageQty"
                    control={control}
                    render={({ field }) => (
                      <div className="flex-1 flex flex-col">
                        <div className="h-[22px] flex items-start">
                          <Label text="Qtd Garagem" required />
                        </div>

                        <QuantitySelector
                          value={field.value}
                          onChange={field.onChange}
                          min={0}
                          disabled
                        />

                        {errors.garageQty && (
                          <MessageError
                            message={errors.garageQty.message as string}
                          />
                        )}
                      </div>
                    )}
                  />
                </>
              )}
            </div>

            {/* ERRO EMBAIXO */}
            {quantityError && (
              <div className="mt-1">
                <MessageError message={quantityError as string} />
              </div>
            )}
          </div>

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs + "mt-3"}>
                <Label text="Imagem" required />

                <Upload
                  fileList={field.value}
                  beforeUpload={() => false}
                  onChange={({ fileList }) => field.onChange(fileList)}
                  onPreview={async (file) => {
                    if (!file.url && !file.preview) {
                      file.preview = URL.createObjectURL(
                        file.originFileObj as File,
                      );
                    }

                    setPreviewImage(file.url || (file.preview as string));
                    setPreviewOpen(true);
                  }}
                  maxCount={1}
                  listType={
                    field.value?.length && !isMobile ? "picture-card" : "text"
                  }
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                  }}
                  style={{ marginTop: "3px", width: "100%" }}
                >
                  {field.value?.length ? null : (
                    <Button
                      style={{
                        width: "100%",
                        borderColor: errors.image ? "#ff4d4f" : undefined,
                      }}
                    >
                      {" "}
                      <UploadIcon width={14} /> Upload
                    </Button>
                  )}
                </Upload>
                {!isMobile && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      open: previewOpen,
                      onOpenChange: (visible) => setPreviewOpen(visible),
                    }}
                    src={previewImage}
                  />
                )}

                {errors.image && (
                  <MessageError message={errors.image.message as string} />
                )}
              </div>
            )}
          />
        </div>
        <div className="md:w-[47%] -sm:w-full">
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Marca" required iconAdd="marca" />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Marca"
                  onChange={field.onChange}
                  status={errors.brand ? "error" : ""}
                  options={filterLists.marks.map((mark) => ({
                    label: mark.nome,
                    value: String(mark.id),
                  }))}
                />
                {errors.brand && (
                  <MessageError message={errors.brand.message as string} />
                )}
              </div>
            )}
          />

          <Controller
            name="types"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Tipos" required iconAdd="tipos" />
                <Select
                  {...field}
                  mode="multiple"
                  style={{ width: "100%", cursor: "pointer" }}
                  className="hover:cursor-pointer"
                  // placeholder="Tipos"
                  onChange={field.onChange}
                  status={errors.types ? "error" : ""}
                  options={filterLists.types.map((mark) => ({
                    label: mark.nome,
                    value: String(mark.id),
                  }))}
                />
                {errors.types && (
                  <MessageError message={errors.types.message as string} />
                )}
              </div>
            )}
          />
          <Controller
            name="line"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Linha" required iconAdd="linha" />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Tipos"
                  onChange={field.onChange}
                  status={errors.line ? "error" : ""}
                  options={filterLists.lines.map((mark) => ({
                    label: mark.nome,
                    value: String(mark.id),
                  }))}
                />
                {errors.line && (
                  <MessageError message={errors.line.message as string} />
                )}
              </div>
            )}
          />

          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Condição" required iconAdd="condicao" />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Status"
                  onChange={field.onChange}
                  status={errors.condition ? "error" : ""}
                  options={filterLists.conditions.map((mark) => ({
                    label: mark.nome,
                    value: String(mark.id),
                  }))}
                />
                {errors.condition && (
                  <MessageError message={errors.condition.message as string} />
                )}
              </div>
            )}
          />
          <Controller
            name="scale"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Escala" required iconAdd="escala" />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Escala"
                  onChange={field.onChange}
                  status={errors.scale ? "error" : ""}
                  options={filterLists.scales.map((mark) => ({
                    label: mark.nome,
                    value: String(mark.id),
                  }))}
                />
                {errors.scale && (
                  <MessageError message={errors.scale.message as string} />
                )}
              </div>
            )}
          />
        </div>
      </div>
    </Modal>
  );
};
