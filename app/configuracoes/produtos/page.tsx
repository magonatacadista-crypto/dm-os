import Link from "next/link";

import Sidebar from "../../components/layout/Sidebar";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

import { prisma } from "../../lib/prisma";
export const dynamic = "force-dynamic";
export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  const totalProdutos = produtos.length;
  const produtosAtivos = produtos.filter(
    (produto) => produto.ativo,
  ).length;
  const produtosInativos = totalProdutos - produtosAtivos;

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title="Produtos"
          subtitle="Gerencie os produtos utilizados nas operações comerciais."
          action={
            <Link
              href="/configuracoes/produtos/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Novo Produto
            </Link>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <p className="text-sm font-medium text-slate-500">
              Total de produtos
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {totalProdutos}
            </p>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Produtos ativos
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {produtosAtivos}
            </p>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Produtos inativos
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {produtosInativos}
            </p>
          </Card>
        </div>

        <Card>
          {produtos.length === 0 ? (
            <EmptyState
              title="Nenhum produto cadastrado"
              description="Cadastre o primeiro produto para utilizá-lo nos Leads e nas operações."
              action={
                <Link
                  href="/configuracoes/produtos/novo"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Cadastrar produto
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
<TableHead>Código</TableHead>
<TableHead>Comissão</TableHead>
<TableHead>Situação</TableHead>
<TableHead>Cadastro</TableHead>
<TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium text-slate-900">
                      {produto.nome}
                    </TableCell>

                    <TableCell>
                      {produto.codigo || "-"}
                    </TableCell>
                    <TableCell>
  {Number(
    produto.comissaoPercentual ?? 0,
  ).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}
  %
</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          produto.ativo
                            ? "success"
                            : "default"
                        }
                      >
                        {produto.ativo
                          ? "Ativo"
                          : "Inativo"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {produto.criadoEm.toLocaleDateString(
                        "pt-BR",
                      )}
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/configuracoes/produtos/${produto.id}/editar`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Editar
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
}