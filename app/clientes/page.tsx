import Link from "next/link";
import Sidebar from "../components/layout/Sidebar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { prisma } from "../lib/prisma";

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: {
      id: "desc",
    },
  });

  const totalClientes = clientes.length;
  const clientesComEmail = clientes.filter(
    (cliente) => cliente.email
  ).length;

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title="Clientes"
          subtitle="Gerencie os clientes cadastrados no D&M OS."
          action={
            <Link
              href="/clientes/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              + Novo Cliente
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm font-medium text-slate-500">
              Total de clientes
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {totalClientes}
              </strong>

              <Badge variant="info">Cadastrados</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Clientes com e-mail
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {clientesComEmail}
              </strong>

              <Badge variant="success">Completos</Badge>
            </div>
          </Card>
        </div>

        <Card>
          {clientes.length === 0 ? (
            <EmptyState
              title="Nenhum cliente cadastrado"
              description="Cadastre o primeiro cliente para começar a utilizar este módulo."
              icon={
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-2xl">
                  👤
                </div>
              }
              action={
                <Link
                  href="/clientes/novo"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  Novo cliente
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">
                      {cliente.nome}
                    </TableCell>

                    <TableCell>{cliente.cpf}</TableCell>

                    <TableCell>{cliente.telefone}</TableCell>

                    <TableCell>
                      {cliente.email || (
                        <span className="text-slate-400">
                          Não informado
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {formatarData(cliente.criadoEm)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/clientes/${cliente.id}`}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Visualizar
                        </Link>

                        <Button
                          type="button"
                          variant="danger"
                          disabled
                          title="A exclusão será implementada posteriormente"
                        >
                          Excluir
                        </Button>
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