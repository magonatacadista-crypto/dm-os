import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../components/layout/Sidebar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";

import { prisma } from "../../lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type InfoProps = {
  label: string;
  value: string | number | null | undefined;
};

type ResumoItemProps = {
  label: string;
  value: string | number | null | undefined;
};

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
}

function formatarDataHora(data: Date | null) {
  if (!data) {
    return null;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

function obterStatus(status: string) {
  switch (status) {
    case "NOVO":
      return {
        texto: "Novo",
        variante: "info" as const,
      };

    case "PRIMEIRO_CONTATO":
      return {
        texto: "Primeiro contato",
        variante: "warning" as const,
      };

    case "DOCUMENTACAO":
      return {
        texto: "Documentação",
        variante: "warning" as const,
      };

    case "DIGITACAO":
      return {
        texto: "Digitação",
        variante: "info" as const,
      };

    case "EM_ANALISE":
      return {
        texto: "Em análise",
        variante: "info" as const,
      };

    case "APROVADO":
      return {
        texto: "Aprovado",
        variante: "success" as const,
      };

    case "PAGO":
      return {
        texto: "Pago",
        variante: "success" as const,
      };

    case "PERDIDO":
      return {
        texto: "Perdido",
        variante: "danger" as const,
      };

    default:
      return {
        texto: status,
        variante: "default" as const,
      };
  }
}

function obterStatusProposta(status: string) {
  switch (status) {
    case "APROVADA":
      return {
        texto: "Aprovada",
        variante: "success" as const,
      };

    case "PAGA":
      return {
        texto: "Paga",
        variante: "success" as const,
      };

    case "REPROVADA":
      return {
        texto: "Reprovada",
        variante: "danger" as const,
      };

    case "CANCELADA":
      return {
        texto: "Cancelada",
        variante: "danger" as const,
      };

    case "EM_ANALISE":
      return {
        texto: "Em análise",
        variante: "warning" as const,
      };

    case "RASCUNHO":
      return {
        texto: "Rascunho",
        variante: "default" as const,
      };

    default:
      return {
        texto: status.replaceAll("_", " "),
        variante: "default" as const,
      };
  }
}

function obterTituloHistorico(tipo: string) {
  switch (tipo) {
    case "LEAD_CRIADO":
      return "Lead criado";

    case "LIGACAO":
      return "Ligação";

    case "WHATSAPP":
      return "WhatsApp";

    case "EMAIL":
      return "E-mail";

    case "PRESENCIAL":
      return "Atendimento presencial";

    case "DOCUMENTACAO":
      return "Documentação";

    case "DIGITACAO":
      return "Digitação";

    case "ANALISE":
      return "Análise";

    case "CONTRATO_PAGO":
      return "Contrato pago";

    case "LEAD_PERDIDO":
      return "Lead perdido";

    case "STATUS_ALTERADO":
      return "Status alterado";

    case "BANCO_ALTERADO":
      return "Banco alterado";

    case "CONVENIO_ALTERADO":
      return "Convênio alterado";

    case "PRODUTO_ALTERADO":
      return "Produto alterado";

    case "VENDEDOR_ALTERADO":
      return "Vendedor alterado";

    case "PROXIMO_CONTATO_ALTERADO":
      return "Próximo contato alterado";
      case "PROPOSTA_ALTERADA":
  return "Proposta atualizada";

    default:
      return "Atualização";
  }
}

function ResumoItem({
  label,
  value,
}: ResumoItemProps) {
  const valorExibido =
    value === null ||
    value === undefined ||
    value === ""
      ? "-"
      : value;

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className="mt-0.5 truncate text-sm font-medium text-slate-800"
        title={String(valorExibido)}
      >
        {valorExibido}
      </p>
    </div>
  );
}

function Info({
  label,
  value,
}: InfoProps) {
  const valorExibido =
    value === null ||
    value === undefined ||
    value === ""
      ? "-"
      : value;

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] text-slate-500">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-medium text-slate-900">
        {valorExibido}
      </p>
    </div>
  );
}

export default async function LeadPage({
  params,
}: Props) {
  const { id } = await params;
  const leadId = Number(id);

  if (!Number.isInteger(leadId) || leadId <= 0) {
    notFound();
  }

  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },

    include: {
      vendedor: true,
      bancoCadastro: true,
      convenioCadastro: true,
      produtoCadastro: true,

      historicos: {
        orderBy: {
          criadoEm: "desc",
        },
      },

      propostas: {
        include: {
          banco: true,
          convenio: true,
          produto: true,
          vendedor: true,
        },

        orderBy: {
          criadoEm: "desc",
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  const status = obterStatus(lead.status);

  const nomeBanco =
    lead.bancoCadastro?.nome ??
    lead.banco ??
    null;

  const nomeConvenio =
    lead.convenioCadastro?.nome ??
    lead.convenio ??
    null;

  const nomeProduto =
    lead.produtoCadastro?.nome ??
    lead.produto ??
    null;

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title={lead.nome}
          subtitle={`Lead #${lead.id}`}
          action={
            <Link
              href={`/leads/${lead.id}/editar`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-3.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Editar Lead
            </Link>
          }
        />

        {/* RESUMO DO LEAD */}

        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Resumo do Lead
              </h2>

              <p className="text-xs text-slate-500">
                Informações principais para consulta rápida.
              </p>
            </div>

            <Badge variant={status.variante}>
              {status.texto}
            </Badge>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ResumoItem
              label="Nome"
              value={lead.nome}
            />

            <ResumoItem
              label="CPF"
              value={lead.cpf}
            />

            <ResumoItem
              label="Telefone"
              value={lead.telefone}
            />

            <ResumoItem
              label="WhatsApp"
              value={lead.whatsapp}
            />

            <ResumoItem
              label="E-mail"
              value={lead.email}
            />
            <ResumoItem
  label="CEP"
  value={lead.cep}
/>

<ResumoItem
  label="Logradouro"
  value={lead.logradouro}
/>

<ResumoItem
  label="Número"
  value={lead.numero}
/>

<ResumoItem
  label="Complemento"
  value={lead.complemento}
/>

<ResumoItem
  label="Bairro"
  value={lead.bairro}
/>

<ResumoItem
  label="Cidade"
  value={lead.cidade}
/>

<ResumoItem
  label="Estado"
  value={lead.estado}
/>

            <ResumoItem
              label="Origem"
              value={lead.origem}
            />

            <ResumoItem
              label="Banco"
              value={nomeBanco}
            />

            <ResumoItem
              label="Convênio"
              value={nomeConvenio}
            />

            <ResumoItem
              label="Produto"
              value={nomeProduto}
            />

            <ResumoItem
              label="Vendedor"
              value={
                lead.vendedor?.nome ??
                "Não atribuído"
              }
            />

            <ResumoItem
              label="Valor solicitado"
              value={formatarMoeda(
                lead.valorSolicitado,
              )}
            />

            <ResumoItem
              label="Valor liberado"
              value={formatarMoeda(
                lead.valorLiberado,
              )}
            />

            <ResumoItem
              label="Próximo contato"
              value={
                formatarDataHora(
                  lead.proximoContato,
                ) ?? "Não agendado"
              }
            />

            <ResumoItem
              label="Último contato"
              value={
                formatarDataHora(
                  lead.ultimoContato,
                ) ?? "Não informado"
              }
            />

            <ResumoItem
              label="Cadastro"
              value={
                formatarDataHora(
                  lead.criadoEm,
                ) ?? "-"
              }
            />
          </div>
        </Card>

        {/* OBSERVAÇÕES + AÇÕES */}

        <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
          <Card>
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Observações
            </h2>

            <p className="whitespace-pre-wrap text-sm text-slate-600">
              {lead.observacoes ||
                "Nenhuma observação cadastrada."}
            </p>
          </Card>

          <Card>
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Ações rápidas
            </h2>

            <div className="grid gap-2">
              <Link
                href={`/leads/${lead.id}/atendimento`}
                className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                + Novo Atendimento
              </Link>

              <Link
                href={`/propostas/novo?leadId=${lead.id}`}
                className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                + Nova Proposta
              </Link>

              <Link
                href={`/leads/${lead.id}/editar`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Editar Lead
              </Link>
            </div>
          </Card>
        </div>

        {/* PROPOSTAS */}

        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Propostas
              </h2>

              <p className="text-xs text-slate-500">
                Propostas vinculadas a este Lead.
              </p>
            </div>

            <Link
              href={`/propostas/novo?leadId=${lead.id}`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              + Nova Proposta
            </Link>
          </div>

          {lead.propostas.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
              Nenhuma proposta cadastrada para este Lead.
            </div>
          ) : (
            <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
              {lead.propostas.map((proposta) => {
                const statusProposta =
                  obterStatusProposta(
                    proposta.status,
                  );

                return (
                  <div
                    key={proposta.id}
                    className="rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Proposta #{proposta.id}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {proposta.banco?.nome ??
                            "Banco não informado"}
                        </p>
                      </div>

                      <Badge
                        variant={
                          statusProposta.variante
                        }
                      >
                        {statusProposta.texto}
                      </Badge>
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <Info
                        label="Convênio"
                        value={
                          proposta.convenio?.nome
                        }
                      />

                      <Info
                        label="Produto"
                        value={
                          proposta.produto?.nome
                        }
                      />

                      <Info
                        label="Vendedor"
                        value={
                          proposta.vendedor?.nome ??
                          "Não atribuído"
                        }
                      />

                      <Info
                        label="Prazo"
                        value={
                          proposta.prazo
                            ? `${proposta.prazo} meses`
                            : null
                        }
                      />

                      <Info
                        label="Solicitado"
                        value={formatarMoeda(
                          proposta.valorSolicitado,
                        )}
                      />

                      <Info
                        label="Aprovado"
                        value={formatarMoeda(
                          proposta.valorAprovado,
                        )}
                      />

                      <Info
                        label="Parcela"
                        value={formatarMoeda(
                          proposta.valorParcela,
                        )}
                      />

                      <Info
                        label="Taxa"
                        value={
                          proposta.taxa
                            ? `${Number(
                                proposta.taxa,
                              ).toFixed(2)}%`
                            : null
                        }
                      />
                    </div>

                    {proposta.observacoes && (
                      <div className="mt-2 rounded-md bg-slate-50 px-3 py-2">
                        <p className="text-[11px] font-medium text-slate-500">
                          Observações
                        </p>

                        <p className="mt-0.5 whitespace-pre-wrap text-xs text-slate-600">
                          {proposta.observacoes}
                        </p>
                      </div>
                    )}

                    <p className="mt-2 text-[10px] text-slate-400">
                      Criada em{" "}
                      {formatarDataHora(
                        proposta.criadoEm,
                      )}
                    </p>
                    <div className="mt-3 flex justify-end">
  <Link
    href={`/propostas/${proposta.id}`}
    className="inline-flex h-8 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
  >
    Abrir Proposta
  </Link>
</div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* HISTÓRICO */}

        <Card>
          <div className="mb-3 border-b border-slate-200 pb-3">
            <h2 className="text-base font-semibold text-slate-900">
              Histórico do Lead
            </h2>

            <p className="text-xs text-slate-500">
              Registro cronológico das movimentações e atendimentos.
            </p>
          </div>

          {lead.historicos.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
              Nenhum histórico registrado para este Lead.
            </div>
          ) : (
            <div>
              {lead.historicos.map(
                (historico, indice) => (
                  <div
                    key={historico.id}
                    className="relative flex gap-3 pb-4"
                  >
                    {indice <
                      lead.historicos.length -
                        1 && (
                      <div className="absolute left-[5px] top-4 h-full w-px bg-slate-200" />
                    )}

                    <div className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-white bg-blue-600 shadow-sm" />

                    <div className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {obterTituloHistorico(
                              historico.tipo,
                            )}
                          </h3>

                          <p className="mt-0.5 whitespace-pre-wrap text-xs text-slate-600">
                            {historico.descricao}
                          </p>
                        </div>

                        <time className="text-[10px] text-slate-400">
                          {formatarDataHora(
                            historico.criadoEm,
                          )}
                        </time>
                      </div>

                      {(historico.valorAnterior ||
                        historico.valorNovo) && (
                        <div className="mt-2 grid gap-2 md:grid-cols-2">
                          <Info
                            label="Valor anterior"
                            value={
                              historico.valorAnterior ??
                              "Não informado"
                            }
                          />

                          <Info
                            label="Novo valor"
                            value={
                              historico.valorNovo ??
                              "Não informado"
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </Card>

        <div>
          <Link href="/leads">
            <Button variant="secondary">
              Voltar
            </Button>
          </Link>
          <Link href="/agenda">
  <Button variant="secondary">
    Voltar para Agenda
  </Button>
</Link>
        </div>
      </main>
    </div>
  );
}