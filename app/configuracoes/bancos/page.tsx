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
import ExcluirBancoButton from "./ExcluirBancoButton";

export default async function BancosPage() {
  const bancos = await prisma.banco.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  const totalBancos = bancos.length;
  const bancosAtivos = bancos.filter((banco) => banco.ativo).length;
  const bancosInativos = totalBancos - bancosAtivos;

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title="Bancos"
          subtitle="Gerencie os bancos utilizados nas operações comerciais."
          action={
            <Link
              href="/configuracoes/bancos/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Novo Banco
            </Link>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <p className="text-sm font-medium text-slate-500">
              Total de bancos
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {totalBancos}
            </p>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Bancos ativos
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {bancosAtivos}
            </p>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Bancos inativos
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {bancosInativos}
            </p>
          </Card>
        </div>

        <Card>
          {bancos.length === 0 ? (
            <EmptyState
              title="Nenhum banco cadastrado"
              description="Cadastre o primeiro banco para começar a padronizar as operações."
              action={
                <Link
                  href="/configuracoes/bancos/novo"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Cadastrar banco
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
                {bancos.map((banco) => (
                  <TableRow key={banco.id}>
                    <TableCell className="font-medium text-slate-900">
                      {banco.nome}
                    </TableCell>

                    <TableCell>{banco.codigo || "-"}</TableCell>

                    <TableCell>
                      <Badge
                        variant={banco.ativo ? "success" : "default"}
                      >
                        {banco.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {banco.criadoEm.toLocaleDateString("pt-BR")}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/configuracoes/bancos/${banco.id}/editar`}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Editar
                        </Link>

                        <ExcluirBancoButton
                          id={banco.id}
                          nome={banco.nome}
                        />
                      </div>
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