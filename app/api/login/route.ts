import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { fetchLogin } from ".";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetchLogin(body);

    const token = response.data.token;

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return res;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Erro na autenticação" },
        { status: error.response?.status || 401 },
      );
    }
    const res = NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );

    res.cookies.delete("token");
    return res;
  }
}
