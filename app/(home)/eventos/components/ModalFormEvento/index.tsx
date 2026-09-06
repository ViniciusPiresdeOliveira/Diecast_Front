"use client";

import { getErrorMessage } from "@/app/utils";
import { useLoading } from "@/app/hooks/useLoading";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, DatePicker, Divider, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Label } from "@/app/components/Label";
import { MessageError } from "@/app/components/MessageError";
import { ModalFormEventoProps } from "./types";
import { EventoFormValues, eventSchema } from "./validation";
import { postEvent } from "@/app/api/evento";
import { buildEventoFormData } from "./utils";
import { formatImage } from "@/app/(home)/utils";

const { TextArea } = Input;

const classNameContainerInputs = "flex flex-col gap-1 mb-4";

export function ModalFormEvento({
  type,
  evento,
  visible,
  handleVisibleFormEvento,
  refreshEventoList,
}: ModalFormEventoProps) {
  const { showLoading, hideLoading } = useLoading();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EventoFormValues>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      titulo: "",
      data: "",
      descricao: "",
      imagens: [],
    },
  });

  useEffect(() => {
    if (!visible) return;

    if (type === "edit" && evento) {
      reset({
        titulo: evento.titulo,
        data: evento.dataEvento,
        descricao: evento.descricao ?? "",
        imagens: (evento.imagens ?? []).map((img) => ({
          uid: String(img.id),
          name: `imagem-${img.id}`,
          status: "done",
          url: formatImage(img.imagem) as string,
        })),
      });
    } else {
      reset({ titulo: "", data: "", descricao: "", imagens: [] });
    }
  }, [visible, type, evento, reset]);

  const handleClose = () => handleVisibleFormEvento(type);

  const onSubmit = async (values: EventoFormValues) => {
    showLoading();
    try {
      const { formData } = buildEventoFormData(values);

      if (type === "edit" && evento) {
        // await updateEvento(evento.id, formData);
        toast.success("Evento atualizado com sucesso");
      } else {
        await postEvent(formData);
        toast.success("Evento criado com sucesso");
      }

      refreshEventoList();
      handleClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      hideLoading();
    }
  };

  const hasErrorInForm = Object.keys(errors).length > 0;

  return (
    <Modal
      title={type === "edit" ? "Editar evento" : "Novo evento"}
      open={visible}
      onOk={handleSubmit(onSubmit)}
      okButtonProps={{ disabled: hasErrorInForm || !isDirty }}
      onCancel={handleClose}
      okText={"Salvar"}
      cancelText="Cancelar"
      width={"50%"}
    >
      <Divider />

      <Controller
        name="titulo"
        control={control}
        render={({ field }) => (
          <div className={classNameContainerInputs}>
            <Label text="Título" required />
            <Input
              {...field}
              placeholder="Ex: Encontro de Colecionadores 2025"
              status={errors.titulo ? "error" : ""}
            />
            {errors.titulo && (
              <MessageError message={errors.titulo.message as string} />
            )}
          </div>
        )}
      />

      <Controller
        name="data"
        control={control}
        render={({ field }) => (
          <div className={classNameContainerInputs}>
            <Label text="Data do evento" required />
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              status={errors.data ? "error" : ""}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) =>
                field.onChange(date ? date.format("YYYY-MM-DD") : "")
              }
            />
            {errors.data && (
              <MessageError message={errors.data.message as string} />
            )}
          </div>
        )}
      />

      <Controller
        name="descricao"
        control={control}
        render={({ field }) => (
          <div className={classNameContainerInputs}>
            <Label text="Descrição" />
            <TextArea
              {...field}
              rows={4}
              placeholder="Descreva o evento: local, destaques, novidades e o que os participantes podem esperar..."
              status={errors.descricao ? "error" : ""}
            />
            {errors.descricao && (
              <MessageError message={errors.descricao.message as string} />
            )}
          </div>
        )}
      />

      <Controller
        name="imagens"
        control={control}
        render={({ field }) => (
          <div className={classNameContainerInputs}>
            <Label text="Imagens" required />
            <Upload
              listType="picture-card"
              multiple
              fileList={field.value}
              beforeUpload={() => false}
              onChange={({ fileList }) => field.onChange(fileList)}
            >
              <div className="flex flex-col items-center">
                <UploadOutlined />
                <span className="mt-1 text-xs">Adicionar</span>
              </div>
            </Upload>
            {errors.imagens && (
              <MessageError message={errors.imagens.message as string} />
            )}
          </div>
        )}
      />
    </Modal>
  );
}
