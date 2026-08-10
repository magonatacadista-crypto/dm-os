import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../../components/layout/Sidebar";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PageHeader from "../../../components/ui/PageHeader";

import { prisma } from "../../../lib/prisma";
import { editarProposta } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarPropostaPage({
  params,
}: Props) {
  const { id } = await params;
  const propostaId = Number(id);

  if (
    !Number.isInteger(propostaId) ||
    propostaId <= 0
  ) {
    notFound();
  }

  const [
    proposta,
    bancos,
    convenios,
    produtos,
    vendedores,
  ] = await Promise.all([
    prisma.proposta.findUnique({
      where: {
        id: propostaId,
      },
      include: {
        lead: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    }),

    prisma.banco.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
      select: {
        id: true,
        nome: true,
        codigo: true,
      },
    }),

    prisma.convenio.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
      select: {
        id: true,
        nome: true,
        codigo: true,
      },
    }),

    prisma.produto.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
      select: {
        id: true,
        nome: true,
        codigo: true,
      },
    }),

    prisma.vendedor.findMany({
      where: {
        situacao: "ATIVO",
      },
      orderBy: {
        nome: "asc",
      },
      select: {
        id: true,
        nome: true,
        matricula: true,
      },
    }),
  ]);

  if (!proposta) {
    notFound();
  }

  const salvarProposta =
    editarProposta.bind(null, proposta.id);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title={`Editar Proposta #${proposta.id}`}
          subtitle={`Lead: ${proposta.lead.nome}`}
        />

        <Card>
          <form action={salvarProposta}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label
                  htmlFor="status"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={proposta.status}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="RASCUNHO">
                    Rascunho
                  </option>

                  <option value="EM_ANALISE">
                    Em análise
                  </option>

                  <option value="APROVADA">
                    Aprovada
                  </option>

                  <option value="REPROVADA">
                    Reprovada
                  </option>

                  <option value="PAGA">
                    Paga
                  </option>

                  <option value="CANCELADA">
                    Cancelada
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="bancoId"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Banco
                </label>

                <select
                  id="bancoId"
                  name="bancoId"
                  defaultValue={proposta.bancoId ?? ""}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Selecione um banco
                  </option>

                  {bancos.map((banco) => (
                    <option
                      key={banco.id}
                      value={banco.id}
                    >
                      {banco.codigo
                        ? `${banco.nome} — ${banco.codigo}`
                        : banco.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="convenioId"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Convênio
                </label>

                <select
                  id="convenioId"
                  name="convenioId"
                  defaultValue={proposta.convenioId ?? ""}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Selecione um convênio
                  </option>

                  {convenios.map((convenio) => (
                    <option
                      key={convenio.id}
                      value={convenio.id}
                    >
                      {convenio.codigo
                        ? `${convenio.nome} — ${convenio.codigo}`
                        : convenio.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="produtoId"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Produto
                </label>

                <select
                  id="produtoId"
                  name="produtoId"
                  defaultValue={proposta.produtoId ?? ""}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Selecione um produto
                  </option>

                  {produtos.map((produto) => (
                    <option
                      key={produto.id}
                      value={produto.id}
                    >
                      {produto.codigo
                        ? `${produto.nome} — ${produto.codigo}`
                        : produto.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="vendedorId"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Vendedor
                </label>

                <select
                  id="vendedorId"
                  name="vendedorId"
                  defaultValue={proposta.vendedorId ?? ""}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Selecione um vendedor
                  </option>

                  {vendedores.map((vendedor) => (
                    <option
                      key={vendedor.id}
                      value={vendedor.id}
                    >
                      {vendedor.matricula
                        ? `${vendedor.nome} — ${vendedor.matricula}`
                        : vendedor.nome}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Valor solicitado"
                name="valorSolicitado"
                defaultValue={String(
                  proposta.valorSolicitado ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Valor aprovado"
                name="valorAprovado"
                defaultValue={String(
                  proposta.valorAprovado ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Prazo"
                name="prazo"
                type="number"
                min="0"
                defaultValue={
                  proposta.prazo ?? ""
                }
              />

              <Input
                label="Valor da parcela"
                name="valorParcela"
                defaultValue={String(
                  proposta.valorParcela ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Taxa"
                name="taxa"
                defaultValue={String(
                  proposta.taxa ?? 0,
                )}
                inputMode="decimal"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="observacoes"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Observações
              </label>

              <textarea
                id="observacoes"
                name="observacoes"
                defaultValue={
                  proposta.observacoes ?? ""
                }
                className="min-h-28 w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Link
                href={`/propostas/${proposta.id}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}