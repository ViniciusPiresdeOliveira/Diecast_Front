"use client";

import { Button, Card, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Label } from "../components/Label";
import { MessageError } from "../components/MessageError";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils";

const { Title, Text } = Typography;

type FormData = {
  login: string;
  password: string;
};

export default function Login() {
  const { handleUser } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Erro ao fazer login");
      }

      const json = await res.json();
      handleUser(json.login, json.role);
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card
        className="
          w-[380px] 
          rounded-xl 
          shadow-[0_10px_30px_rgba(0,0,0,0.3)]
        "
      >
        <div className="text-center mb-5">
          <Title level={3} className="mb-1! !text-[var(--color-blue-primary)]">
            Painel Admin
          </Title>
          <Text type="secondary">Acesse sua conta</Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* USERNAME */}
          <div className="space-y-1">
            <Label text="Nome" required />

            <Controller
              name="login"
              control={control}
              rules={{ required: "Nome é obrigatório" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Digite seu nome"
                  className="h-10"
                />
              )}
            />

            {errors.login && <MessageError message={errors.login.message!} />}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <Label text="Senha" required />

            <Controller
              name="password"
              control={control}
              rules={{ required: "Senha é obrigatória" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Digite sua senha"
                  className="h-10"
                />
              )}
            />

            {errors.password && (
              <MessageError message={errors.password.message!} />
            )}
          </div>

          {/* BUTTON */}
          <Button
            htmlType="submit"
            loading={isSubmitting}
            block
            className="
              mt-2 
              h-10 
              font-semibold 
              !bg-[var(--color-blue-primary)] 
              !text-[var(--color-gray-200)] 
              !border-none
              hover:!brightness-110
            "
          >
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
}
