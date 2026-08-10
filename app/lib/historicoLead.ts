import type { TipoHistoricoLead } from "../generated/prisma/enums";

import { prisma } from "./prisma";

type RegistrarHistoricoParams = {
  leadId: number;
  tipo: TipoHistoricoLead;
  descricao: string;
  valorAnterior?: string | null;
  valorNovo?: string | null;
};

export async function registrarHistoricoLead({
  leadId,
  tipo,
  descricao,
  valorAnterior,
  valorNovo,
}: RegistrarHistoricoParams) {
  await prisma.historicoLead.create({
    data: {
      leadId,
      tipo,
      descricao,
      valorAnterior: valorAnterior ?? null,
      valorNovo: valorNovo ?? null,
    },
  });
}