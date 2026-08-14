"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "../lib/prisma";

function converterValorMonetario(
  valor: FormDataEntryValue | null,
) {
  let texto = String(valor ?? "")
    .trim()
    .replace(/[^\d,.-]/g, "");

  if (!texto) {
    return 0;
  }

  const temVirgula = texto.includes(",");
  const temPonto = texto.includes(".");

  if (temVirgula && temPonto) {
    const ultimaVirgula =
      texto.lastIndexOf(",");

    const ultimoPonto =
      texto.lastIndexOf(".");

    if (ultimaVirgula > ultimoPonto) {
      texto = texto
        .replace(/\./g, "")
        .replace(",", ".");
    } else {
      texto = texto.replace(/,/g, "");
    }
  } else if (temVirgula) {
    texto = texto.replace(",", ".");
  } else if (
    /^\d{1,3}(\.\d{3})+$/.test(texto)
  ) {
    texto = texto.replace(/\./g, "");
  }

  const numero = Number(texto);

  return Number.isFinite(numero)
    ? numero
    : 0;
}

function converterInteiro(
  valor: FormDataEntryValue | null,
) {
  const numero = Number(valor);

  if (!Number.isInteger(numero)) {
    return null;
  }

  return numero;
}

export async function salvarMeta(
  formData: FormData,
) {
  const vendedorId =
    converterInteiro(
      formData.get("vendedorId"),
    );

  const mes =
    converterInteiro(
      formData.get("mes"),
    );

  const ano =
    converterInteiro(
      formData.get("ano"),
    );

  const metaContratos =
    converterInteiro(
      formData.get("metaContratos"),
    );

  if (
    !vendedorId ||
    vendedorId <= 0
  ) {
    throw new Error(
      "Vendedor inválido.",
    );
  }

  if (
    !mes ||
    mes < 1 ||
    mes > 12
  ) {
    throw new Error(
      "Mês inválido.",
    );
  }

  if (
    !ano ||
    ano < 2000 ||
    ano > 2100
  ) {
    throw new Error(
      "Ano inválido.",
    );
  }

  if (
    metaContratos === null ||
    metaContratos < 0
  ) {
    throw new Error(
      "Meta de contratos inválida.",
    );
  }

  const vendedor =
    await prisma.vendedor.findUnique({
      where: {
        id: vendedorId,
      },

      select: {
        id: true,
      },
    });

  if (!vendedor) {
    throw new Error(
      "Vendedor não encontrado.",
    );
  }

  const metaValor =
    converterValorMonetario(
      formData.get("metaValor"),
    );

  await prisma.metaMensalVendedor.upsert({
    where: {
      vendedorId_ano_mes: {
        vendedorId,
        ano,
        mes,
      },
    },

    update: {
      metaValor,
      metaContratos,
    },

    create: {
      vendedorId,
      ano,
      mes,
      metaValor,
      metaContratos,
    },
  });

  revalidatePath("/metas");
  revalidatePath("/producao");
}