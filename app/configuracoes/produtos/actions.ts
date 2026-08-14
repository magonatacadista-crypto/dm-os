"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../../lib/prisma";

export type ProdutoActionState = {
  erro: string | null;
};

function converterPercentual(
  valor: FormDataEntryValue | null,
) {
  const texto = String(valor ?? "")
    .trim()
    .replace("%", "")
    .replace(",", ".");

  if (!texto) {
    return 0;
  }

  const numero = Number(texto);

  if (!Number.isFinite(numero)) {
    return null;
  }

  if (numero < 0 || numero > 100) {
    return null;
  }

  return numero;
}

export async function criarProduto(
  _estadoAnterior: ProdutoActionState,
  formData: FormData,
): Promise<ProdutoActionState> {
  const nome = String(
    formData.get("nome") ?? "",
  ).trim();

  const codigo = String(
    formData.get("codigo") ?? "",
  ).trim();

  const ativo =
    formData.get("ativo") === "on";

  const comissaoPercentual =
    converterPercentual(
      formData.get(
        "comissaoPercentual",
      ),
    );

  if (!nome) {
    return {
      erro: "Informe o nome do produto.",
    };
  }

  if (comissaoPercentual === null) {
    return {
      erro: "Informe uma comissão válida entre 0 e 100%.",
    };
  }

  const produtosCadastrados =
    await prisma.produto.findMany({
      select: {
        nome: true,
      },
    });

  const nomeNormalizado =
    nome.toLocaleLowerCase("pt-BR");

  const produtoDuplicado =
    produtosCadastrados.some(
      (produto) =>
        produto.nome
          .trim()
          .toLocaleLowerCase(
            "pt-BR",
          ) === nomeNormalizado,
    );

  if (produtoDuplicado) {
    return {
      erro:
        "Já existe um produto cadastrado com esse nome.",
    };
  }

  try {
    await prisma.produto.create({
      data: {
        nome,
        codigo:
          codigo || null,
        ativo,
        comissaoPercentual,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao cadastrar produto:",
      error,
    );

    return {
      erro:
        "Não foi possível cadastrar o produto. Tente novamente.",
    };
  }

  revalidatePath(
    "/configuracoes/produtos",
  );

  redirect(
    "/configuracoes/produtos",
  );
}
export async function editarProduto(
  produtoId: number,
  _estadoAnterior: ProdutoActionState,
  formData: FormData,
): Promise<ProdutoActionState> {
  if (
    !Number.isInteger(produtoId) ||
    produtoId <= 0
  ) {
    return {
      erro: "Produto inválido.",
    };
  }

  const nome = String(
    formData.get("nome") ?? "",
  ).trim();

  const codigo = String(
    formData.get("codigo") ?? "",
  ).trim();

  const ativo =
    formData.get("ativo") === "on";

  const comissaoPercentual =
    converterPercentual(
      formData.get(
        "comissaoPercentual",
      ),
    );

  if (!nome) {
    return {
      erro: "Informe o nome do produto.",
    };
  }

  if (comissaoPercentual === null) {
    return {
      erro:
        "Informe uma comissão válida entre 0 e 100%.",
    };
  }

  const produtoAtual =
    await prisma.produto.findUnique({
      where: {
        id: produtoId,
      },

      select: {
        id: true,
      },
    });

  if (!produtoAtual) {
    return {
      erro: "Produto não encontrado.",
    };
  }

  const produtosCadastrados =
    await prisma.produto.findMany({
      where: {
        id: {
          not: produtoId,
        },
      },

      select: {
        nome: true,
      },
    });

  const nomeNormalizado =
    nome.toLocaleLowerCase("pt-BR");

  const produtoDuplicado =
    produtosCadastrados.some(
      (produto) =>
        produto.nome
          .trim()
          .toLocaleLowerCase(
            "pt-BR",
          ) === nomeNormalizado,
    );

  if (produtoDuplicado) {
    return {
      erro:
        "Já existe outro produto cadastrado com esse nome.",
    };
  }

  try {
    await prisma.produto.update({
      where: {
        id: produtoId,
      },

      data: {
        nome,
        codigo:
          codigo || null,
        ativo,
        comissaoPercentual,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao editar produto:",
      error,
    );

    return {
      erro:
        "Não foi possível atualizar o produto. Tente novamente.",
    };
  }

  revalidatePath(
    "/configuracoes/produtos",
  );

  redirect(
    "/configuracoes/produtos",
  );
}