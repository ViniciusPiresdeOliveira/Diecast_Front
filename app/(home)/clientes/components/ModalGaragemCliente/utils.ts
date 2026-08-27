import { fetchAddressByCep } from "@/app/api/viacep";
import { BuildEnderecoParams, BuildMessageParams } from "./types";

export const calculateDaysInGarage = (dataCadastro: string): number => {
  const normalized = dataCadastro.replace(/(\.\d{3})\d*Z$/, "$1Z");
  const date = new Date(normalized);

  if (isNaN(date.getTime())) return 0;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays < 0 ? 0 : diffDays;
};

export const buildGaragemMessage = async ({
  nome,
  minis,
  cep,
  numero,
}: BuildMessageParams): Promise<string> => {
  const listaMinis = minis.map((m) => `    • ${m.nome} - ${m.ano}`).join("\n");

  const endereco = await buildEnderecoFromCep({ cep, numero });

  const blocoEndereco = cep
    ? `📍 *Endereço de entrega:*\n${endereco}`
    : `📍 *Endereço:*\n${endereco}`;

  const confirmacao = cep
    ? "\n\n✅ Você confirma o envio das miniaturas listadas acima, para o endereço informado?"
    : "";

  return `Olá, *${nome}*! 👋

Vimos no grupo do WhatsApp que você gostaria de receber sua garagem. Aqui está o resumo:

🅿️ *Miniaturas em garagem:*
${listaMinis || "\tNenhuma miniatura encontrada."}

${blocoEndereco}${confirmacao}`;
};

export const buildEnderecoFromCep = async ({
  cep,
  numero,
}: BuildEnderecoParams): Promise<string> => {
  if (!cep) {
    return "Por favor, informe seu CEP para que possamos validar o endereço de entrega.";
  }

  const data = await fetchAddressByCep(cep);

  if (!data) {
    return "Não foi possível localizar o endereço pelo CEP informado. Por favor, verifique e informe novamente.";
  }

  const endereco = `${data.logradouro || ""}, ${numero || "s/n"} - ${
    data.bairro || ""
  }, ${data.localidade || ""} - ${data.uf || ""}`;

  return endereco.trim();
};

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};
