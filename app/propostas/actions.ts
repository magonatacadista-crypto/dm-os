"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function converterNumeroInteiro(
  valor: FormDataEntryValue | null,
) {
  const texto = String(valor ?? "").trim();

  if (!texto) {
    return null;
  }

  const numero = Number(texto);

  if (
    !Number.isInteger(numero) ||
    numero < 0
  ) {
    return null;
  }

  return numero;
}

function converterIdOpcional(
  valor: FormDataEntryValue | null,
) {
  const numero = Number(valor);

  if (
    !Number.isInteger(numero) ||
    numero <= 0
  ) {
    return null;
  }

  return numero;
}

function converterStatusProposta(
  valor: FormDataEntryValue | null,
) {
  const status = String(
    valor ?? "",
  ).trim();

  switch (status) {
    case "RASCUNHO":
    case "EM_ANALISE":
    case "APROVADA":
    case "REPROVADA":
    case "PAGA":
    case "CANCELADA":
      return status;

    default:
      throw new Error(
        "Status da proposta inválido.",
      );
  }
}

function formatarStatusProposta(
  status: string,
) {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho";

    case "EM_ANALISE":
      return "Em análise";

    case "APROVADA":
      return "Aprovada";

    case "REPROVADA":
      return "Reprovada";

    case "PAGA":
      return "Paga";

    case "CANCELADA":
      return "Cancelada";

    default:
      return status;
  }
}

function formatarMoeda(valor: unknown) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  ).format(Number(valor ?? 0));
}

function formatarTaxa(valor: unknown) {
  return `${Number(valor ?? 0).toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    },
  )}%`;
}

function valorAlterado(
  anterior: unknown,
  novo: number,
) {
  return Number(anterior ?? 0) !== novo;
}

async function validarLead(
  leadId: number,
) {
  const lead =
    await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        id: true,
      },
    });

  if (!lead) {
    throw new Error(
      "Lead não encontrado.",
    );
  }
}

export async function criarProposta(
  leadId: number,
  formData: FormData,
) {
  if (
    !Number.isInteger(leadId) ||
    leadId <= 0
  ) {
    throw new Error("Lead inválido.");
  }

  const status =
    converterStatusProposta(
      formData.get("status"),
    );

  const bancoId =
    converterIdOpcional(
      formData.get("bancoId"),
    );

  const convenioId =
    converterIdOpcional(
      formData.get("convenioId"),
    );

  const produtoId =
    converterIdOpcional(
      formData.get("produtoId"),
    );

  const vendedorId =
    converterIdOpcional(
      formData.get("vendedorId"),
    );

  const prazo =
    converterNumeroInteiro(
      formData.get("prazo"),
    );

  const observacoes = String(
    formData.get("observacoes") ?? "",
  ).trim();

  await validarLead(leadId);

  await prisma.proposta.create({
    data: {
      leadId,
      status,
      bancoId,
      convenioId,
      produtoId,
      vendedorId,

      valorSolicitado:
        converterValorMonetario(
          formData.get(
            "valorSolicitado",
          ),
        ),

      valorAprovado:
        converterValorMonetario(
          formData.get(
            "valorAprovado",
          ),
        ),

      prazo,

      valorParcela:
        converterValorMonetario(
          formData.get(
            "valorParcela",
          ),
        ),

      taxa:
        converterValorMonetario(
          formData.get("taxa"),
        ),

      observacoes:
        observacoes || null,
    },
  });

  revalidatePath(
    `/leads/${leadId}`,
  );

  redirect(`/leads/${leadId}`);
}

export async function editarProposta(
  propostaId: number,
  formData: FormData,
) {
  if (
    !Number.isInteger(propostaId) ||
    propostaId <= 0
  ) {
    throw new Error(
      "Proposta inválida.",
    );
  }

  const propostaAtual =
    await prisma.proposta.findUnique({
      where: {
        id: propostaId,
      },

      select: {
        id: true,
        leadId: true,
        status: true,

        bancoId: true,
        convenioId: true,
        produtoId: true,
        vendedorId: true,

        valorSolicitado: true,
        valorAprovado: true,
        prazo: true,
        valorParcela: true,
        taxa: true,
        observacoes: true,

        banco: {
          select: {
            nome: true,
          },
        },

        convenio: {
          select: {
            nome: true,
          },
        },

        produto: {
          select: {
            nome: true,
          },
        },

        vendedor: {
          select: {
            nome: true,
          },
        },
      },
    });

  if (!propostaAtual) {
    throw new Error(
      "Proposta não encontrada.",
    );
  }

  const status =
    converterStatusProposta(
      formData.get("status"),
    );

  const bancoId =
    converterIdOpcional(
      formData.get("bancoId"),
    );

  const convenioId =
    converterIdOpcional(
      formData.get("convenioId"),
    );

  const produtoId =
    converterIdOpcional(
      formData.get("produtoId"),
    );

  const vendedorId =
    converterIdOpcional(
      formData.get("vendedorId"),
    );

  const prazo =
    converterNumeroInteiro(
      formData.get("prazo"),
    );

  const valorSolicitado =
    converterValorMonetario(
      formData.get(
        "valorSolicitado",
      ),
    );

  const valorAprovado =
    converterValorMonetario(
      formData.get(
        "valorAprovado",
      ),
    );

  const valorParcela =
    converterValorMonetario(
      formData.get(
        "valorParcela",
      ),
    );

  const taxa =
    converterValorMonetario(
      formData.get("taxa"),
    );

  const observacoes = String(
    formData.get("observacoes") ?? "",
  ).trim();

  const [
    novoBanco,
    novoConvenio,
    novoProduto,
    novoVendedor,
  ] = await Promise.all([
    bancoId
      ? prisma.banco.findUnique({
          where: {
            id: bancoId,
          },
          select: {
            nome: true,
          },
        })
      : null,

    convenioId
      ? prisma.convenio.findUnique({
          where: {
            id: convenioId,
          },
          select: {
            nome: true,
          },
        })
      : null,

    produtoId
      ? prisma.produto.findUnique({
          where: {
            id: produtoId,
          },
          select: {
            nome: true,
          },
        })
      : null,

    vendedorId
      ? prisma.vendedor.findUnique({
          where: {
            id: vendedorId,
          },
          select: {
            nome: true,
          },
        })
      : null,
  ]);

  const alteracoes: string[] = [];

  if (
    propostaAtual.status !== status
  ) {
    alteracoes.push(
      `Status: ${formatarStatusProposta(
        propostaAtual.status,
      )} → ${formatarStatusProposta(
        status,
      )}`,
    );
  }

  if (
    propostaAtual.bancoId !== bancoId
  ) {
    alteracoes.push(
      `Banco: ${
        propostaAtual.banco?.nome ??
        "Não informado"
      } → ${
        novoBanco?.nome ??
        "Não informado"
      }`,
    );
  }

  if (
    propostaAtual.convenioId !==
    convenioId
  ) {
    alteracoes.push(
      `Convênio: ${
        propostaAtual.convenio
          ?.nome ??
        "Não informado"
      } → ${
        novoConvenio?.nome ??
        "Não informado"
      }`,
    );
  }

  if (
    propostaAtual.produtoId !==
    produtoId
  ) {
    alteracoes.push(
      `Produto: ${
        propostaAtual.produto?.nome ??
        "Não informado"
      } → ${
        novoProduto?.nome ??
        "Não informado"
      }`,
    );
  }

  if (
    propostaAtual.vendedorId !==
    vendedorId
  ) {
    alteracoes.push(
      `Vendedor: ${
        propostaAtual.vendedor?.nome ??
        "Não atribuído"
      } → ${
        novoVendedor?.nome ??
        "Não atribuído"
      }`,
    );
  }

  if (
    valorAlterado(
      propostaAtual.valorSolicitado,
      valorSolicitado,
    )
  ) {
    alteracoes.push(
      `Valor solicitado: ${formatarMoeda(
        propostaAtual.valorSolicitado,
      )} → ${formatarMoeda(
        valorSolicitado,
      )}`,
    );
  }

  if (
    valorAlterado(
      propostaAtual.valorAprovado,
      valorAprovado,
    )
  ) {
    alteracoes.push(
      `Valor aprovado: ${formatarMoeda(
        propostaAtual.valorAprovado,
      )} → ${formatarMoeda(
        valorAprovado,
      )}`,
    );
  }

  if (
    propostaAtual.prazo !== prazo
  ) {
    alteracoes.push(
      `Prazo: ${
        propostaAtual.prazo ??
        "Não informado"
      } → ${
        prazo ?? "Não informado"
      } meses`,
    );
  }

  if (
    valorAlterado(
      propostaAtual.valorParcela,
      valorParcela,
    )
  ) {
    alteracoes.push(
      `Parcela: ${formatarMoeda(
        propostaAtual.valorParcela,
      )} → ${formatarMoeda(
        valorParcela,
      )}`,
    );
  }

  if (
    valorAlterado(
      propostaAtual.taxa,
      taxa,
    )
  ) {
    alteracoes.push(
      `Taxa: ${formatarTaxa(
        propostaAtual.taxa,
      )} → ${formatarTaxa(taxa)}`,
    );
  }

  if (
    (propostaAtual.observacoes ??
      "") !== observacoes
  ) {
    alteracoes.push(
      "Observações atualizadas.",
    );
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.proposta.update({
        where: {
          id: propostaId,
        },

        data: {
          status,
          bancoId,
          convenioId,
          produtoId,
          vendedorId,
          valorSolicitado,
          valorAprovado,
          prazo,
          valorParcela,
          taxa,

          observacoes:
            observacoes || null,
        },
      });

      if (alteracoes.length > 0) {
        await tx.historicoLead.create({
          data: {
            leadId:
              propostaAtual.leadId,

            tipo:
              "PROPOSTA_ALTERADA",

            descricao: [
              `Proposta #${propostaId} atualizada:`,
              ...alteracoes,
            ].join("\n"),

            valorAnterior: null,
            valorNovo: null,
          },
        });
      }
    },
  );

  revalidatePath(
    `/leads/${propostaAtual.leadId}`,
  );

  revalidatePath(
    `/propostas/${propostaId}`,
  );

  redirect(
    `/propostas/${propostaId}`,
  );
}