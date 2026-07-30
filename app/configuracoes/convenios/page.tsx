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

export default async function ConveniosPage() {
  const convenios = await prisma.convenio.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  const totalConvenios = convenios.length;
  const conveniosAtivos = convenios.filter(
    (convenio) => convenio.ativo,
  ).length;
  const conveniosInativos = totalConvenios - conveniosAtivos;

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title="Convênios"
          subtitle="Gerencie os convênios utilizados nas operações de crédito."
          action={
            <Link
              href="/configuracoes/convenios/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Novo Convênio
            </Link>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <p className="text-sm font-medium text-slate-500">
              Total de convênios
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {totalConvenios}
            </p>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Convênios ativos
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {conveniosAtivos}
            </p>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Convênios inativos
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {conveniosInativos}
            </p>
          </Card>
        </div>

        <Card>
          {convenios.length === 0 ? (
            <EmptyState
              title="Nenhum convênio cadastrado"
              description="Cadastre o primeiro convênio para utilizá-lo nas operações e nos Leads."
              action={
                <Link
                  href="/configuracoes/convenios/novo"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Cadastrar convênio
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {convenios.map((convenio) => (
                  <TableRow key={convenio.id}>
                    <TableCell className="font-medium text-slate-900">
                      {convenio.nome}
                    </TableCell>

                    <TableCell>{convenio.codigo || "-"}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          convenio.ativo ? "success" : "default"
                        }
                      >
                        {convenio.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {convenio.criadoEm.toLocaleDateString("pt-BR")}
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/configuracoes/convenios/${convenio.id}/editar`}
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