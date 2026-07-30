"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../../lib/prisma";

export type BancoActionState = {
  erro: string | null;
};

export async function criarBanco(
  _estadoAnterior: BancoActionState,
  formData: FormData,
): Promise<BancoActionState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const codigo = String(formData.get("codigo") ?? "").trim();
  const ativo = formData.get("ativo") === "on";

  if (!nome) {
    return {
      erro: "Informe o nome do banco.",
    };
  }

  const bancosCadastrados = await prisma.banco.findMany({
    select: {
      nome: true,
    },
  });

  const nomeNormalizado = nome.toLocaleLowerCase("pt-BR");

  const bancoDuplicado = bancosCadastrados.some(
    (banco) =>
      banco.nome.trim().toLocaleLowerCase("pt-BR") === nomeNormalizado,
  );

  if (bancoDuplicado) {
    return {
      erro: "Já existe um banco cadastrado com esse nome.",
    };
  }

  try {
    await prisma.banco.create({
      data: {
        nome,
        codigo: codigo || null,
        ativo,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar banco:", error);

    return {
      erro: "Não foi possível cadastrar o banco. Tente novamente.",
    };
  }

  revalidatePath("/configuracoes/bancos");
  redirect("/configuracoes/bancos");
}

export async function atualizarBanco(
  _estadoAnterior: BancoActionState,
  formData: FormData,
): Promise<BancoActionState> {
  const id = Number(formData.get("id"));
  const nome = String(formData.get("nome") ?? "").trim();
  const codigo = String(formData.get("codigo") ?? "").trim();
  const ativo = formData.get("ativo") === "on";

  if (!Number.isInteger(id) || id <= 0) {
    return {
      erro: "Banco inválido.",
    };
  }

  if (!nome) {
    return {
      erro: "Informe o nome do banco.",
    };
  }

  const bancoExistente = await prisma.banco.findUnique({
    where: {
      id,
    },
  });

  if (!bancoExistente) {
    return {
      erro: "Banco não encontrado.",
    };
  }

  const bancosCadastrados = await prisma.banco.findMany({
    where: {
      id: {
        not: id,
      },
    },
    select: {
      nome: true,
    },
  });

  const nomeNormalizado = nome.toLocaleLowerCase("pt-BR");

  const bancoDuplicado = bancosCadastrados.some(
    (banco) =>
      banco.nome.trim().toLocaleLowerCase("pt-BR") === nomeNormalizado,
  );

  if (bancoDuplicado) {
    return {
      erro: "Já existe outro banco cadastrado com esse nome.",
    };
  }

  try {
    await prisma.banco.update({
      where: {
        id,
      },
      data: {
        nome,
        codigo: codigo || null,
        ativo,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar banco:", error);

    return {
      erro: "Não foi possível atualizar o banco. Tente novamente.",
    };
  }

  revalidatePath("/configuracoes/bancos");
  revalidatePath(`/configuracoes/bancos/${id}/editar`);

  redirect("/configuracoes/bancos");
}export async function excluirBanco(id: number) {
  const banco = await prisma.banco.findUnique({
    where: {
      id,
    },
  });

  if (!banco) {
    throw new Error("Banco não encontrado.");
  }

  await prisma.banco.delete({
    where: {
      id,
    },
  });

  revalidatePath("/configuracoes/bancos");
}