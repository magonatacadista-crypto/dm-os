"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../../lib/prisma";

export type ConvenioActionState = {
  erro: string | null;
};

export async function criarConvenio(
  _estadoAnterior: ConvenioActionState,
  formData: FormData,
): Promise<ConvenioActionState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const codigo = String(formData.get("codigo") ?? "").trim();
  const ativo = formData.get("ativo") === "on";

  if (!nome) {
    return {
      erro: "Informe o nome do convênio.",
    };
  }

  const conveniosCadastrados = await prisma.convenio.findMany({
    select: {
      nome: true,
    },
  });

  const nomeNormalizado = nome.toLocaleLowerCase("pt-BR");

  const convenioDuplicado = conveniosCadastrados.some(
    (convenio) =>
      convenio.nome.trim().toLocaleLowerCase("pt-BR") ===
      nomeNormalizado,
  );

  if (convenioDuplicado) {
    return {
      erro: "Já existe um convênio cadastrado com esse nome.",
    };
  }

  try {
    await prisma.convenio.create({
      data: {
        nome,
        codigo: codigo || null,
        ativo,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar convênio:", error);

    return {
      erro: "Não foi possível cadastrar o convênio. Tente novamente.",
    };
  }

  revalidatePath("/configuracoes/convenios");
  redirect("/configuracoes/convenios");
}