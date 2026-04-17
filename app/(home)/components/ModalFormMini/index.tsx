import { getAllScalesMini } from "@/app/api/escala_miniatura";
import { getAllLinesMini } from "@/app/api/linha_miniatura";
import { getAllMarksMini } from "@/app/api/marca_miniatura";
import { postMiniatura, putMiniatura } from "@/app/api/miniatura";
import { getAllStatusMini } from "@/app/api/status_miniatura";
import { getAllTypesMini } from "@/app/api/tipo_miniatura";
import { Label } from "@/app/components/Label";
import { TypeAdd } from "@/app/components/Label/types";
import { MessageError } from "@/app/components/MessageError";
import { useLoading } from "@/app/hooks/useLoading";
import { useTypeDevice } from "@/app/hooks/useTypeDevice";
import { GenericGetTypes } from "@/app/types";
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
import { defaultValuesForm } from "./utils";
import { MiniFormValues, miniSchema } from "./validation";

export const ModalFormMini = ({
  visible,
  mini,
  handleVisibleFormMini,
  type,
  refreshMiniList,
}: ModalFormMiniProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [listMarksMini, setListMarksMini] = useState<GenericGetTypes[]>([]);
  const [listTypesMini, setListTypesMini] = useState<GenericGetTypes[]>([]);
  const [listLinesMini, setListLinesMini] = useState<GenericGetTypes[]>([]);
  const [listStatusMini, setListStatusMini] = useState<GenericGetTypes[]>([]);
  const [listScalesMini, setListScalesMini] = useState<GenericGetTypes[]>([]);
  const [refreshRequests, setRefreshRequests] = useState<TypeAdd | "">("");
  const { isMobile } = useTypeDevice();
  const { showLoading, hideLoading } = useLoading();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(miniSchema),
    defaultValues: {
      ...defaultValuesForm,
    },
  });

  const handleForceRefreshLists = (type: TypeAdd | "") => {
    setRefreshRequests(() => type);
  };

  const handleCancel = () => {
    handleVisibleFormMini(type);
    reset();
  };

  const fetchGetAllScalesMini = async () => {
    showLoading();
    try {
      const { data } = await getAllScalesMini();
      setListScalesMini(data);
    } catch (e) {
    } finally {
      hideLoading();
    }
  };

  const fetchGetAllTypesMini = async () => {
    showLoading();
    try {
      const { data } = await getAllTypesMini();
      setListTypesMini(data);
    } catch (e) {
    } finally {
      hideLoading();
    }
  };

  const fetchGetAllMarksMini = async () => {
    showLoading();
    try {
      const { data } = await getAllMarksMini();
      setListMarksMini(data);
    } catch (e) {
    } finally {
      hideLoading();
    }
  };

  const fetchGetAllLinesMini = async () => {
    showLoading();
    try {
      const { data } = await getAllLinesMini();
      setListLinesMini(data);
    } catch (e) {
    } finally {
      hideLoading();
    }
  };

  const fetchGetAllStatusMini = async () => {
    showLoading();
    try {
      const { data } = await getAllStatusMini();
      setListStatusMini(data);
    } catch (e) {
    } finally {
      hideLoading();
    }
  };
  console.log("mini assd f gff ", watch());

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
    if (isModalOpen) {
      fetchGetAllMarksMini();
      fetchGetAllTypesMini();
      fetchGetAllLinesMini();
      fetchGetAllStatusMini();
      fetchGetAllScalesMini();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (refreshRequests.length === 0) {
      return;
    }
    const refreshMap = {
      escala: fetchGetAllScalesMini,
      linha: fetchGetAllLinesMini,
      tipos: fetchGetAllTypesMini,
      marca: fetchGetAllMarksMini,
      status: fetchGetAllStatusMini,
    };

    const key = refreshRequests as keyof typeof refreshMap;
    const executeRefresh = refreshMap[key];

    if (executeRefresh) {
      executeRefresh();
      handleForceRefreshLists("");
    }
  }, [refreshRequests]);

  useEffect(() => {
    setIsModalOpen(visible);
  }, [visible, mini, type, reset]);

  useEffect(() => {
    setIsModalOpen(visible);
  }, [visible]);

  useEffect(() => {
    if (!mini) {
      reset(defaultValuesForm);
      return;
    }
    reset({
      name: mini.nome,
      year: mini.ano,
      price: Math.round(mini.valor * 100), // converte pra centavos
      stock: 1, // se tiver no objeto real
      brand: String(mini.marca?.id),
      types: mini.tipos?.map((t) => String(t.id)) || [],
      line: String(mini.linha?.id),
      status: String(mini.status?.id),
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

  // const manipulateStateOfSaveButton = () => {
  //   if (type === "edit") {
  //     if (isDirty) {
  //       return false;
  //     }
  //     return true;
  //   }
  //   if (type === "add") {
  //     if (isDirty) {
  //       return false;
  //     }
  //     return true;
  //   }
  // };

  console.log("mini asd ", mini);

  return (
    <Modal
      title={type === "add" ? "Criar Miniatura" : "Editar Miniatura"}
      open={isModalOpen}
      onOk={handleSubmit(handleRegisterMini)}
      okButtonProps={{
        disabled: hasErrorInForm || !isDirty,
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

          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Quantidade no Estoque" required />
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  status={errors.stock ? "error" : ""}
                  // placeholder="Quantidade no Estoque"
                  min={1}
                  type="number"
                />

                {errors.stock && (
                  <MessageError message={errors.stock.message as string} />
                )}
              </div>
            )}
          />

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
                <Label
                  text="Marca"
                  required
                  iconAdd="marca"
                  handleForceRefreshLists={handleForceRefreshLists}
                />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Marca"
                  onChange={field.onChange}
                  status={errors.brand ? "error" : ""}
                  options={listMarksMini.map((mark) => ({
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
                <Label
                  text="Tipos"
                  required
                  iconAdd="tipos"
                  handleForceRefreshLists={handleForceRefreshLists}
                />
                <Select
                  {...field}
                  mode="multiple"
                  style={{ width: "100%", cursor: "pointer" }}
                  className="hover:cursor-pointer"
                  // placeholder="Tipos"
                  onChange={field.onChange}
                  status={errors.types ? "error" : ""}
                  options={listTypesMini.map((mark) => ({
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
                <Label
                  text="Linha"
                  required
                  iconAdd="linha"
                  handleForceRefreshLists={handleForceRefreshLists}
                />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Tipos"
                  onChange={field.onChange}
                  status={errors.line ? "error" : ""}
                  options={listLinesMini.map((mark) => ({
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
            name="status"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label
                  text="Status"
                  required
                  iconAdd="status"
                  handleForceRefreshLists={handleForceRefreshLists}
                />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Status"
                  onChange={field.onChange}
                  status={errors.status ? "error" : ""}
                  options={listStatusMini.map((mark) => ({
                    label: mark.nome,
                    value: String(mark.id),
                  }))}
                />
                {errors.status && (
                  <MessageError message={errors.status.message as string} />
                )}
              </div>
            )}
          />
          <Controller
            name="scale"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label
                  text="Escala"
                  required
                  iconAdd="escala"
                  handleForceRefreshLists={handleForceRefreshLists}
                />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Escala"
                  onChange={field.onChange}
                  status={errors.scale ? "error" : ""}
                  options={listScalesMini.map((mark) => ({
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
