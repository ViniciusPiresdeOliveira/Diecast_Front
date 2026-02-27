import { Label } from "@/app/components/Label";
import { MessageError } from "@/app/components/MessageError";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image, Input, InputNumber, Modal, Select, Upload } from "antd";
import { Option } from "antd/es/mentions";
import { UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ModalFormMiniProps } from "./types";
import { defaultValuesForm } from "./utils";
import { MiniFormValues, miniSchema } from "./validation";

export const ModalFormMini = ({
  visible,
  mini,
  handleVisibleFormMini,
  type,
}: ModalFormMiniProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(miniSchema),
    defaultValues: {
      ...defaultValuesForm,
    },
  });

  const onSubmit = (data: MiniFormValues) => {
    console.log("Dados validados:", data);
    handleVisibleFormMini();
    reset();
  };

  const handleCancel = () => {
    handleVisibleFormMini();
    reset();
  };
  useEffect(() => {
    setIsModalOpen(visible);

    if (mini && type === "edit") {
      reset(mini);
    }
  }, [visible, mini, type, reset]);

  useEffect(() => {
    setIsModalOpen(visible);
  }, [visible]);

  const classNameContainerInputs = "flex-col mb-2";

  return (
    <Modal
      title={type === "add" ? "Criar Miniatura" : "Editar Miniatura"}
      open={isModalOpen}
      onOk={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
      width={"90%"}
    >
      <div className="md:flex -sm:flex-col justify-between">
        <div className="md:w-[47%] -sm:w-full">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Nome" />
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
            name="brand"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Marca" />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Marca"
                  onChange={field.onChange}
                  status={errors.salePrice ? "error" : ""}
                >
                  <Option value="hotwheels">Hot Wheels</Option>
                  <Option value="matchbox">Matchbox</Option>
                  <Option value="gtmini">GT Mini</Option>
                </Select>
                {errors.brand && (
                  <MessageError message={errors.brand.message as string} />
                )}
              </div>
            )}
          />

          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Ano" />
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
            name="types"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Tipos" />
                <Select
                  {...field}
                  mode="multiple"
                  style={{ width: "100%" }}
                  // placeholder="Tipos"
                  onChange={field.onChange}
                  status={errors.types ? "error" : ""}
                >
                  <Option value="jdm">JDM</Option>
                  <Option value="supercar">Supercar</Option>
                  <Option value="muscle">Muscle</Option>
                  <Option value="classic">Clássico</Option>
                </Select>
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
                <Label text="Linha" />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Tipos"
                  onChange={field.onChange}
                  status={errors.line ? "error" : ""}
                >
                  <Option value="thunt">T-Hunt</Option>
                  <Option value="superthunt">Super T-Hunt</Option>
                  <Option value="mainline">Mainline</Option>
                </Select>
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
                <Label text="Status" />

                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Status"
                  onChange={field.onChange}
                  status={errors.status ? "error" : ""}
                >
                  <Option value="Loose">Loose</Option>
                  <Option value="Blister">Blister</Option>
                </Select>
              </div>
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs + "mt-3"}>
                <Label text="Imagem" />

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
                  listType={"picture-card"}
                  style={{ marginTop: "3px" }}
                >
                  {field.value?.length ? null : <UploadIcon />}
                </Upload>

                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                  }}
                  src={previewImage}
                />

                {errors.image && (
                  <MessageError message={errors.image.message as string} />
                )}
              </div>
            )}
          />
        </div>
        <div className="md:w-[47%] -sm:w-full">
          <Controller
            name="scale"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Escala" />
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  // placeholder="Escala"
                  onChange={field.onChange}
                  status={errors.scale ? "error" : ""}
                >
                  <Option value="thunt">1/24</Option>
                  <Option value="superthunt">1/64</Option>
                </Select>
                {errors.scale && (
                  <MessageError message={errors.scale.message as string} />
                )}
              </div>
            )}
          />
          <Controller
            name="costPrice"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Preço de Custo" />
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  status={errors.costPrice ? "error" : ""}
                  // placeholder="Preço de Custo"
                  min={0}
                  type="number"
                />
                {errors.costPrice && (
                  <MessageError message={errors.costPrice.message as string} />
                )}
              </div>
            )}
          />
          <Controller
            name="salePrice"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Preço de Venda" />
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  status={errors.salePrice ? "error" : ""}
                  // placeholder="Preço de Venda"
                  min={0}
                  type="number"
                />
                {errors.salePrice && (
                  <MessageError message={errors.salePrice.message as string} />
                )}
              </div>
            )}
          />
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Quantidade no Estoque" />
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  status={errors.stock ? "error" : ""}
                  // placeholder="Quantidade no Estoque"
                  min={0}
                  type="number"
                />

                {errors.stock && (
                  <MessageError message={errors.stock.message as string} />
                )}
              </div>
            )}
          />

          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Peso" />
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  status={errors.weight ? "error" : ""}
                  // placeholder="Peso"
                  min={0}
                  type="number"
                />

                {errors.weight && (
                  <MessageError message={errors.weight.message as string} />
                )}
              </div>
            )}
          />

          <Controller
            name="volume"
            control={control}
            render={({ field }) => (
              <div className={classNameContainerInputs}>
                <Label text="Volume" />
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  status={errors.volume ? "error" : ""}
                  // placeholder="Volume"
                  min={0}
                  type="number"
                />

                {errors.volume && (
                  <MessageError message={errors.volume.message as string} />
                )}
              </div>
            )}
          />
        </div>
      </div>
    </Modal>
  );
};
