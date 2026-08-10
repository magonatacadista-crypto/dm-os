"use client";

import Link from "next/link";
import {
  DragEvent,
  useOptimistic,
  useState,
  useTransition,
} from "react";

import Badge from "../components/ui/Badge";
import { atualizarStatusLead } from "./actions";

type LeadPipeline = {
  id: number;
  nome: string;
  telefone: string;
  status: string;
  valorSolicitado: number;
  banco: string | null;
  convenio: string | null;
  vendedor: string | null;
};

type EtapaPipeline = {
  status: string;
  titulo: string;
  variante:
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "default";
};

type PipelineBoardProps = {
  leads: LeadPipeline[];
  etapas: EtapaPipeline[];
};

type AtualizacaoOtimista = {
  leadId: number;
  novoStatus: string;
};

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export default function PipelineBoard({
  leads,
  etapas,
}: PipelineBoardProps) {
  const [leadArrastadoId, setLeadArrastadoId] =
    useState<number | null>(null);

  const [statusDestino, setStatusDestino] =
    useState<string | null>(null);

  const [erro, setErro] = useState<string | null>(null);

  const [isPending, iniciarTransicao] = useTransition();

  const [leadsOtimistas, atualizarLeadsOtimistas] =
    useOptimistic(
      leads,
      (
        estadoAtual: LeadPipeline[],
        atualizacao: AtualizacaoOtimista,
      ) =>
        estadoAtual.map((lead) =>
          lead.id === atualizacao.leadId
            ? {
                ...lead,
                status: atualizacao.novoStatus,
              }
            : lead,
        ),
    );

  function iniciarArraste(
    evento: DragEvent<HTMLDivElement>,
    leadId: number,
  ) {
    setLeadArrastadoId(leadId);
    setErro(null);

    evento.dataTransfer.effectAllowed = "move";
    evento.dataTransfer.setData(
      "text/plain",
      String(leadId),
    );
  }

  function permitirSoltar(
    evento: DragEvent<HTMLElement>,
    status: string,
  ) {
    evento.preventDefault();
    evento.dataTransfer.dropEffect = "move";
    setStatusDestino(status);
  }

  function sairDaColuna(
    evento: DragEvent<HTMLElement>,
  ) {
    const elementoRelacionado =
      evento.relatedTarget as Node | null;

    if (
      elementoRelacionado &&
      evento.currentTarget.contains(elementoRelacionado)
    ) {
      return;
    }

    setStatusDestino(null);
  }

  function finalizarArraste() {
    setLeadArrastadoId(null);
    setStatusDestino(null);
  }

  function soltarLead(
    evento: DragEvent<HTMLElement>,
    novoStatus: string,
  ) {
    evento.preventDefault();

    const leadId = Number(
      evento.dataTransfer.getData("text/plain"),
    );

    setStatusDestino(null);
    setLeadArrastadoId(null);
    setErro(null);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      setErro("Não foi possível identificar o Lead.");
      return;
    }

    const leadAtual = leadsOtimistas.find(
      (lead) => lead.id === leadId,
    );

    if (!leadAtual || leadAtual.status === novoStatus) {
      return;
    }

    iniciarTransicao(async () => {
      atualizarLeadsOtimistas({
        leadId,
        novoStatus,
      });

      try {
        await atualizarStatusLead(
          leadId,
          novoStatus,
        );
      } catch (error) {
        console.error(
          "Erro ao atualizar status do Lead:",
          error,
        );

        setErro(
          "Não foi possível mover o Lead. Atualize a página e tente novamente.",
        );
      }
    });
  }

  return (
    <div>
      {erro && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {erro}
        </div>
      )}

      {isPending && (
        <p
          aria-live="polite"
          className="mb-3 text-sm text-slate-500"
        >
          Salvando alteração do Pipeline...
        </p>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-5">
          {etapas.map((etapa) => {
            const leadsDaEtapa =
              leadsOtimistas.filter(
                (lead) =>
                  lead.status === etapa.status,
              );

            const colunaAtiva =
              statusDestino === etapa.status;

            return (
              <section
                key={etapa.status}
                onDragOver={(evento) =>
                  permitirSoltar(
                    evento,
                    etapa.status,
                  )
                }
                onDragLeave={sairDaColuna}
                onDrop={(evento) =>
                  soltarLead(
                    evento,
                    etapa.status,
                  )
                }
                className={`w-80 shrink-0 rounded-xl border bg-slate-50 transition ${
                  colunaAtiva
                    ? "border-blue-400 ring-2 ring-blue-100"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-slate-900">
                      {etapa.titulo}
                    </h2>

                    <Badge
                      variant={etapa.variante}
                    >
                      {leadsDaEtapa.length}
                    </Badge>
                  </div>
                </div>

                <div className="min-h-40 space-y-3 p-3">
                  {leadsDaEtapa.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-400">
                      Arraste um Lead para esta etapa.
                    </div>
                  ) : (
                    leadsDaEtapa.map((lead) => {
                      const estaSendoArrastado =
                        leadArrastadoId === lead.id;

                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(evento) =>
                            iniciarArraste(
                              evento,
                              lead.id,
                            )
                          }
                          onDragEnd={finalizarArraste}
                          className={`cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition active:cursor-grabbing ${
                            estaSendoArrastado
                              ? "opacity-40"
                              : "hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <Link
                              href={`/leads/${lead.id}`}
                              className="font-semibold text-slate-900 hover:text-blue-600"
                            >
                              {lead.nome}
                            </Link>

                            <span className="text-xs text-slate-400">
                              #{lead.id}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2 text-sm text-slate-600">
                            <p>
                              <span className="font-medium">
                                Telefone:
                              </span>{" "}
                              {lead.telefone}
                            </p>

                            <p>
                              <span className="font-medium">
                                Banco:
                              </span>{" "}
                              {lead.banco ??
                                "Não informado"}
                            </p>

                            <p>
                              <span className="font-medium">
                                Convênio:
                              </span>{" "}
                              {lead.convenio ??
                                "Não informado"}
                            </p>

                            <p>
                              <span className="font-medium">
                                Vendedor:
                              </span>{" "}
                              {lead.vendedor ??
                                "Não atribuído"}
                            </p>
                          </div>

                          <div className="mt-4 border-t border-slate-100 pt-3">
                            <p className="text-sm font-semibold text-slate-900">
                              {formatarMoeda(
                                lead.valorSolicitado,
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}