"use server";

import { redirect } from "next/navigation";

import { prisma } from "../../../lib/prisma";

const tiposPermitidos = [
  "LIGACAO",
  "WHATSAPP",
  "EMAIL",
  "PRESENCIAL",
  "DOCUMENTACAO",
  "DIGITACAO",
  "ANALISE",
  "CONTRATO_PAGO",
  "LEAD_PERDIDO",
] as const;

type TipoAtendimento = (typeof tiposPermitidos)[number];

function converterTipoAtendimento(
  valor: FormDataEntryValue | null,
): TipoAtendimento {
  const tipo = String(valor ?? "").trim();

  if (
    !tiposPermitidos.includes(
      tipo as TipoAtendimento,
    )
  ) {
    throw new Error("Tipo de atendimento inválido.");
  }

  return tipo as TipoAtendimento;
}

function converterDataOpcional(
  valor: FormDataEntryValue | null,
) {
  const texto = String(valor ?? "").trim();

  if (!texto) {
    return null;
  }

  const data = new Date(texto);

  if (Number.isNaN(data.getTime())) {
    throw new Error(
      "A data do próximo contato é inválida.",
    );
  }

  return data;
}

export async function criarAtendimento(
  leadId: number,
  formData: FormData,
) {
  if (!Number.isInteger(leadId) || leadId <= 0) {
    throw new Error("Lead inválido.");
  }

  const tipo = converterTipoAtendimento(
    formData.get("tipo"),
  );

  const descricao = String(
    formData.get("descricao") ?? "",
  ).trim();

  const proximoContato = converterDataOpcional(
    formData.get("proximoContato"),
  );

  if (!descricao) {
    throw new Error(
      "Informe a descrição do atendimento.",
    );
  }

  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
    select: {
      id: true,
    },
  });

  if (!lead) {
    throw new Error("Lead não encontrado.");
  }

  const agora = new Date();

  await prisma.$transaction([
    prisma.historicoLead.create({
      data: {
        leadId,
        tipo,
        descricao,
        criadoEm: agora,
      },
    }),

    prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        ultimoContato: agora,
        proximoContato,
      },
    }),
  ]);

  redirect(`/leads/${leadId}`);
}