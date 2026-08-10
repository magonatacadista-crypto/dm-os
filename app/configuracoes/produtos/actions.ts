"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../../lib/prisma";

export type ProdutoActionState = {
  erro: string | null;
};

export async function criarProduto(
  _estadoAnterior: ProdutoActionState,
  formData: FormData,
): Promise<ProdutoActionState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const codigo = String(formData.get("codigo") ?? "").trim();
  const ativo = formData.get("ativo") === "on";

  if (!nome) {
    return {
      erro: "Informe o nome do produto.",
    };
  }

  const produtosCadastrados = await prisma.produto.findMany({
    select: {
      nome: true,
    },
  });

  const nomeNormalizado = nome.toLocaleLowerCase("pt-BR");

  const produtoDuplicado = produtosCadastrados.some(
    (produto) =>
      produto.nome.trim().toLocaleLowerCase("pt-BR") ===
      nomeNormalizado,
  );

  if (produtoDuplicado) {
    return {
      erro: "Já existe um produto cadastrado com esse nome.",
    };
  }

  try {
    await prisma.produto.create({
      data: {
        nome,
        codigo: codigo || null,
        ativo,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);

    return {
      erro: "Não foi possível cadastrar o produto. Tente novamente.",
    };
  }

  revalidatePath("/configuracoes/produtos");
  redirect("/configuracoes/produtos");
}