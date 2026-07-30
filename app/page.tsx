import Sidebar from "./components/layout/Sidebar";
import Badge from "./components/ui/Badge";
import Card from "./components/ui/Card";
import PageHeader from "./components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/Table";
import { prisma } from "./lib/prisma";

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
}

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

export default async function Home() {
  const [
    totalClientes,
    totalVendedores,
    vendedoresAtivos,
    vendedores,
    ultimosClientes,
  ] = await Promise.all([
    prisma.cliente.count(),
    prisma.vendedor.count(),
    prisma.vendedor.count({
      where: {
        situacao: "ATIVO",
      },
    }),
    prisma.vendedor.findMany({
      select: {
        metaMensal: true,
        metaContratos: true,
      },
    }),
    prisma.cliente.findMany({
      orderBy: {
        criadoEm: "desc",
      },
      take: 5,
    }),
  ]);

  const metaMensalTotal = vendedores.reduce(
    (total, vendedor) => total + Number(vendedor.metaMensal),
    0
  );

  const metaContratosTotal = vendedores.reduce(
    (total, vendedor) => total + vendedor.metaContratos,
    0
  );

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title="Dashboard"
          subtitle="Visão geral da operação da D&M Crédito Consignado."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Card>
            <p className="text-sm font-medium text-slate-500">
              Clientes
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
              Vendedores
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {totalVendedores}
              </strong>

              <Badge>Pessoas</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Vendedores ativos
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {vendedoresAtivos}
              </strong>

              <Badge variant="success">Ativos</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Meta mensal
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <strong className="text-2xl text-slate-900">
                {formatarMoeda(metaMensalTotal)}
              </strong>

              <Badge variant="warning">Equipe</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Meta de contratos
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {metaContratosTotal}
              </strong>

              <Badge variant="info">Mensal</Badge>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Clientes cadastrados recentemente
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Últimos registros incluídos no sistema.
              </p>
            </div>

            {ultimosClientes.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                Nenhum cliente cadastrado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {ultimosClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        {cliente.nome}
                      </TableCell>

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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-slate-900">
              Resumo operacional
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">
                  Equipe ativa
                </span>

                <strong className="text-slate-900">
                  {vendedoresAtivos} de {totalVendedores}
                </strong>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">
                  Meta financeira
                </span>

                <strong className="text-right text-slate-900">
                  {formatarMoeda(metaMensalTotal)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Meta de contratos
                </span>

                <strong className="text-slate-900">
                  {metaContratosTotal}
                </strong>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}