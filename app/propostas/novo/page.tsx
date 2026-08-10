import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";

import { prisma } from "../../lib/prisma";
import { criarProposta } from "../actions";

type Props = {
  searchParams: Promise<{
    leadId?: string;
  }>;
};

export default async function NovaPropostaPage({
  searchParams,
}: Props) {
  const { leadId } = await searchParams;
  const id = Number(leadId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const [lead, bancos, convenios, produtos, vendedores] =
    await Promise.all([
      prisma.lead.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          nome: true,
          telefone: true,
          bancoId: true,
          convenioId: true,
          produtoId: true,
          vendedorId: true,
          valorSolicitado: true,
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

  if (!lead) {
    notFound();
  }

  const salvarProposta = criarProposta.bind(null, lead.id);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title="Nova Proposta"
          subtitle={`Cadastre uma proposta para ${lead.nome}.`}
        />

        <Card>
          <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Lead selecionado
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {lead.nome}
            </h2>

            <p className="mt-1 text-slate-500">
              {lead.telefone}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              ID do Lead: {lead.id}
            </p>
          </div>

          <form action={salvarProposta}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="w-full">
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue="RASCUNHO"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

              <div className="w-full">
                <label
                  htmlFor="bancoId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Banco
                </label>

                <select
                  id="bancoId"
                  name="bancoId"
                  defaultValue={lead.bancoId ?? ""}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

              <div className="w-full">
                <label
                  htmlFor="convenioId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Convênio
                </label>

                <select
                  id="convenioId"
                  name="convenioId"
                  defaultValue={lead.convenioId ?? ""}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

              <div className="w-full">
                <label
                  htmlFor="produtoId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Produto
                </label>

                <select
                  id="produtoId"
                  name="produtoId"
                  defaultValue={lead.produtoId ?? ""}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

              <div className="w-full">
                <label
                  htmlFor="vendedorId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Vendedor responsável
                </label>

                <select
                  id="vendedorId"
                  name="vendedorId"
                  defaultValue={lead.vendedorId ?? ""}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  lead.valorSolicitado ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Valor aprovado"
                name="valorAprovado"
                placeholder="0,00"
                inputMode="decimal"
              />

              <Input
                label="Prazo"
                name="prazo"
                type="number"
                placeholder="Ex.: 84"
                min="0"
              />

              <Input
                label="Valor da parcela"
                name="valorParcela"
                placeholder="0,00"
                inputMode="decimal"
              />

              <Input
                label="Taxa"
                name="taxa"
                placeholder="0,00"
                inputMode="decimal"
              />
            </div>

            <div className="mt-8">
              <label
                htmlFor="observacoes"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Observações
              </label>

              <textarea
                id="observacoes"
                name="observacoes"
                className="min-h-36 w-full rounded-lg border border-slate-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Inclua informações relevantes sobre a proposta..."
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Link
                href={`/leads/${lead.id}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <Button type="submit">
                Salvar Proposta
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}