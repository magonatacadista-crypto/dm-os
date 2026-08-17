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

function converterDataOpcional(
  valor: FormDataEntryValue | null,
) {
  const texto = String(valor ?? "").trim();

  if (!texto) {
    return null;
  }

  const data = new Date(
    `${texto}T12:00:00`,
  );

  if (Number.isNaN(data.getTime())) {
    return null;
  }

  return data;
}

function converterStatusContrato(
  valor: FormDataEntryValue | null,
) {
  const status = String(valor ?? "").trim();

  switch (status) {
    case "RASCUNHO":
    case "DIGITADO":
    case "EM_ANALISE":
    case "APROVADO":
    case "PAGO":
    case "CANCELADO":
      return status;

    default:
      throw new Error(
        "Status do contrato inválido.",
      );
  }
}

function formatarStatusContrato(
  status: string,
) {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho";

    case "DIGITADO":
      return "Digitado";

    case "EM_ANALISE":
      return "Em análise";

    case "APROVADO":
      return "Aprovado";

    case "PAGO":
      return "Pago";

    case "CANCELADO":
      return "Cancelado";

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

function formatarDataHistorico(
  data: Date | null,
) {
  if (!data) {
    return "Não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

function datasIguais(
  anterior: Date | null,
  nova: Date | null,
) {
  if (!anterior && !nova) {
    return true;
  }

  if (!anterior || !nova) {
    return false;
  }

  return (
    anterior.getTime() === nova.getTime()
  );
}

function valorAlterado(
  anterior: unknown,
  novo: number,
) {
  return Number(anterior ?? 0) !== novo;
}

export async function criarContrato(
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

  const proposta =
    await prisma.proposta.findUnique({
      where: {
        id: propostaId,
      },

      include: {
        contratos: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
    });

  if (!proposta) {
    throw new Error(
      "Proposta não encontrada.",
    );
  }

  if (
    proposta.status !== "APROVADA" &&
    proposta.status !== "PAGA"
  ) {
    throw new Error(
      "Somente propostas aprovadas ou pagas podem gerar contrato.",
    );
  }

  if (proposta.contratos.length > 0) {
    throw new Error(
      "Esta proposta já possui contrato vinculado.",
    );
  }

  const numero = String(
    formData.get("numero") ?? "",
  ).trim();

  const observacoes = String(
    formData.get("observacoes") ?? "",
  ).trim();

  const contrato =
    await prisma.contrato.create({
      data: {
        numero: numero || null,

        status:
          converterStatusContrato(
            formData.get("status"),
          ),

        propostaId: proposta.id,
        leadId: proposta.leadId,

        bancoId: proposta.bancoId,
        convenioId: proposta.convenioId,
        produtoId: proposta.produtoId,
        vendedorId: proposta.vendedorId,

        valorContratado:
          converterValorMonetario(
            formData.get(
              "valorContratado",
            ),
          ),

        valorLiberado:
          converterValorMonetario(
            formData.get(
              "valorLiberado",
            ),
          ),

        prazo:
          converterNumeroInteiro(
            formData.get("prazo"),
          ),

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

        dataDigitacao:
          converterDataOpcional(
            formData.get(
              "dataDigitacao",
            ),
          ),

        dataAprovacao:
          converterDataOpcional(
            formData.get(
              "dataAprovacao",
            ),
          ),

        dataPagamento:
          converterDataOpcional(
            formData.get(
              "dataPagamento",
            ),
          ),

        observacoes:
          observacoes || null,
      },
    });

  revalidatePath("/contratos");

  revalidatePath(
    `/propostas/${proposta.id}`,
  );

  revalidatePath(
    `/leads/${proposta.leadId}`,
  );

  redirect(
    `/contratos/${contrato.id}`,
  );
}

export async function editarContrato(
  contratoId: number,
  formData: FormData,
) {
  if (
    !Number.isInteger(contratoId) ||
    contratoId <= 0
  ) {
    throw new Error(
      "Contrato inválido.",
    );
  }

  const contratoAtual =
    await prisma.contrato.findUnique({
      where: {
        id: contratoId,
      },

      select: {
        id: true,
        numero: true,
        leadId: true,
        propostaId: true,
        produtoId: true,

comissaoPercentual: true,
valorComissao: true,

        status: true,

        valorContratado: true,
        valorLiberado: true,

        prazo: true,
        valorParcela: true,
        taxa: true,

        dataDigitacao: true,
        dataAprovacao: true,
        dataPagamento: true,

        observacoes: true,
      },
    });

  if (!contratoAtual) {
    throw new Error(
      "Contrato não encontrado.",
    );
  }

  const numero = String(
    formData.get("numero") ?? "",
  ).trim();

  const status =
    converterStatusContrato(
      formData.get("status"),
    );

  const valorContratado =
    converterValorMonetario(
      formData.get(
        "valorContratado",
      ),
    );

  const valorLiberado =
    converterValorMonetario(
      formData.get(
        "valorLiberado",
      ),
    );

  const prazo =
    converterNumeroInteiro(
      formData.get("prazo"),
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

  const dataDigitacao =
    converterDataOpcional(
      formData.get(
        "dataDigitacao",
      ),
    );

  const dataAprovacao =
    converterDataOpcional(
      formData.get(
        "dataAprovacao",
      ),
    );

  const dataPagamento =
    converterDataOpcional(
      formData.get(
        "dataPagamento",
      ),
    );

  const observacoes = String(
    formData.get("observacoes") ?? "",
  ).trim();
  const deveCongelarComissao =
  status === "PAGO" &&
  (
    contratoAtual.status !== "PAGO" ||
    (
      Number(
        contratoAtual.comissaoPercentual,
      ) === 0 &&
      Number(
        contratoAtual.valorComissao,
      ) === 0
    )
  );

let comissaoPercentual =
  Number(
    contratoAtual.comissaoPercentual,
  );

let valorComissao =
  Number(
    contratoAtual.valorComissao,
  );

if (deveCongelarComissao) {
  if (contratoAtual.produtoId) {
    const produto =
      await prisma.produto.findUnique({
        where: {
          id: contratoAtual.produtoId,
        },

        select: {
          comissaoPercentual: true,
        },
      });

    comissaoPercentual =
      Number(
        produto?.comissaoPercentual ?? 0,
      );
  } else {
    comissaoPercentual = 0;
  }

  valorComissao =
    valorLiberado *
    (comissaoPercentual / 100);
}

  const alteracoes: string[] = [];

  const numeroAnterior =
    contratoAtual.numero ?? "";

  if (numeroAnterior !== numero) {
    alteracoes.push(
      `Número: ${
        numeroAnterior ||
        "Não informado"
      } → ${
        numero ||
        "Não informado"
      }`,
    );
  }

  if (
    contratoAtual.status !== status
  ) {
    alteracoes.push(
      `Status: ${formatarStatusContrato(
        contratoAtual.status,
      )} → ${formatarStatusContrato(
        status,
      )}`,
    );
  }

  if (
    valorAlterado(
      contratoAtual.valorContratado,
      valorContratado,
    )
  ) {
    alteracoes.push(
      `Valor contratado: ${formatarMoeda(
        contratoAtual.valorContratado,
      )} → ${formatarMoeda(
        valorContratado,
      )}`,
    );
  }

  if (
    valorAlterado(
      contratoAtual.valorLiberado,
      valorLiberado,
    )
  ) {
    alteracoes.push(
      `Valor liberado: ${formatarMoeda(
        contratoAtual.valorLiberado,
      )} → ${formatarMoeda(
        valorLiberado,
      )}`,
    );
  }

  if (
    contratoAtual.prazo !== prazo
  ) {
    alteracoes.push(
      `Prazo: ${
        contratoAtual.prazo ??
        "Não informado"
      } → ${
        prazo ?? "Não informado"
      } meses`,
    );
  }

  if (
    valorAlterado(
      contratoAtual.valorParcela,
      valorParcela,
    )
  ) {
    alteracoes.push(
      `Parcela: ${formatarMoeda(
        contratoAtual.valorParcela,
      )} → ${formatarMoeda(
        valorParcela,
      )}`,
    );
  }

  if (
    valorAlterado(
      contratoAtual.taxa,
      taxa,
    )
  ) {
    alteracoes.push(
      `Taxa: ${formatarTaxa(
        contratoAtual.taxa,
      )} → ${formatarTaxa(
        taxa,
      )}`,
    );
  }

  if (
    !datasIguais(
      contratoAtual.dataDigitacao,
      dataDigitacao,
    )
  ) {
    alteracoes.push(
      `Data de digitação: ${formatarDataHistorico(
        contratoAtual.dataDigitacao,
      )} → ${formatarDataHistorico(
        dataDigitacao,
      )}`,
    );
  }

  if (
    !datasIguais(
      contratoAtual.dataAprovacao,
      dataAprovacao,
    )
  ) {
    alteracoes.push(
      `Data de aprovação: ${formatarDataHistorico(
        contratoAtual.dataAprovacao,
      )} → ${formatarDataHistorico(
        dataAprovacao,
      )}`,
    );
  }

  if (
    !datasIguais(
      contratoAtual.dataPagamento,
      dataPagamento,
    )
  ) {
    alteracoes.push(
      `Data de pagamento: ${formatarDataHistorico(
        contratoAtual.dataPagamento,
      )} → ${formatarDataHistorico(
        dataPagamento,
      )}`,
    );
  }

  if (
    (contratoAtual.observacoes ?? "") !==
    observacoes
  ) {
    alteracoes.push(
      "Observações atualizadas.",
    );
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.contrato.update({
        where: {
          id: contratoId,
        },

        data: {
          numero: numero || null,
          status,
          valorContratado,
          valorLiberado,
          comissaoPercentual,
valorComissao,
          prazo,
          valorParcela,
          taxa,
          dataDigitacao,
          dataAprovacao,
          dataPagamento,

          observacoes:
            observacoes || null,
        },
      });

      if (alteracoes.length > 0) {
        await tx.historicoLead.create({
          data: {
            leadId:
              contratoAtual.leadId,

            tipo:
              "CONTRATO_ALTERADO",

            descricao: [
              `Contrato ${
                numero ||
                contratoAtual.numero ||
                `#${contratoId}`
              } atualizado:`,
              ...alteracoes,
            ].join("\n"),

            valorAnterior: null,
            valorNovo: null,
          },
        });
      }
    },
  );

  revalidatePath("/contratos");

  revalidatePath(
    `/contratos/${contratoId}`,
  );

  revalidatePath(
    `/propostas/${contratoAtual.propostaId}`,
  );

  revalidatePath(
    `/leads/${contratoAtual.leadId}`,
  );

  redirect(
    `/contratos/${contratoId}`,
  );
}