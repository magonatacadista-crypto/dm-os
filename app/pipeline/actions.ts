"use server";

import { revalidatePath } from "next/cache";

import { StatusLead } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

function converterStatusLead(status: string): StatusLead {
  switch (status) {
    case "NOVO":
      return StatusLead.NOVO;

    case "PRIMEIRO_CONTATO":
      return StatusLead.PRIMEIRO_CONTATO;

    case "DOCUMENTACAO":
      return StatusLead.DOCUMENTACAO;

    case "DIGITACAO":
      return StatusLead.DIGITACAO;

    case "EM_ANALISE":
      return StatusLead.EM_ANALISE;

    case "APROVADO":
      return StatusLead.APROVADO;

    case "PAGO":
      return StatusLead.PAGO;

    case "PERDIDO":
      return StatusLead.PERDIDO;

    default:
      throw new Error("Status inválido.");
  }
}

export async function atualizarStatusLead(
  leadId: number,
  novoStatus: string,
) {
  if (!Number.isInteger(leadId) || leadId <= 0) {
    throw new Error("Lead inválido.");
  }

  const status = converterStatusLead(novoStatus);

  const leadExistente = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
    select: {
      id: true,
    },
  });

  if (!leadExistente) {
    throw new Error("Lead não encontrado.");
  }

  await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      status,
    },
  });

  revalidatePath("/pipeline");
  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/");
}