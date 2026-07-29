import Link from "next/link";
import Sidebar from "../components/layout/Sidebar";
import ExcluirVendedorButton from "../components/vendedores/ExcluirVendedorButton";
import { prisma } from "../lib/prisma";

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
}

function formatarSituacao(situacao: string) {
  switch (situacao) {
    case "ATIVO":
      return {
        texto: "Ativo",
        classe: "bg-green-100 text-green-700",
      };

    case "INATIVO":
      return {
        texto: "Inativo",
        classe: "bg-red-100 text-red-700",
      };

    case "AFASTADO":
      return {
        texto: "Afastado",
        classe: "bg-amber-100 text-amber-700",
      };

    default:
      return {
        texto: situacao,
        classe: "bg-slate-100 text-slate-700",
      };
  }
}

export default async function VendedoresPage() {
  const vendedores = await prisma.vendedor.findMany({
    orderBy: {
      id: "desc",
    },
  });

  const totalVendedores = vendedores.length;

  const totalAtivos = vendedores.filter(
    (vendedor) => vendedor.situacao === "ATIVO"
  ).length;

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden bg-slate-100 p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-4xl font-bold sm:text-5xl">
              Vendedores
            </h1>

            <p className="mt-2 text-gray-500">
              Total cadastrados: <strong>{totalVendedores}</strong>
              {" | "}
              Ativos: <strong>{totalAtivos}</strong>
            </p>
          </div>

          <Link
            href="/vendedores/novo"
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            + Novo Vendedor
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar vendedor..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="w-full max-w-full overflow-x-auto rounded-xl bg-white p-4 shadow-md sm:p-6">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b">
                <th className="whitespace-nowrap py-3 pr-4 text-left">
                  Nome
                </th>

                <th className="whitespace-nowrap py-3 pr-4 text-left">
                  CPF
                </th>

                <th className="whitespace-nowrap py-3 pr-4 text-left">
                  Telefone
                </th>

                <th className="whitespace-nowrap py-3 pr-4 text-left">
                  Cargo
                </th>

                <th className="whitespace-nowrap py-3 pr-4 text-left">
                  Situação
                </th>

                <th className="whitespace-nowrap py-3 pr-4 text-left">
                  Meta mensal
                </th>

                <th className="whitespace-nowrap py-3 pr-4 text-left">
                  Meta de contratos
                </th>

                <th className="whitespace-nowrap py-3 text-center">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {vendedores.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-gray-500"
                  >
                    Nenhum vendedor cadastrado.
                  </td>
                </tr>
              ) : (
                vendedores.map((vendedor) => {
                  const situacao = formatarSituacao(
                    vendedor.situacao
                  );

                  return (
                    <tr
                      key={vendedor.id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap py-3 pr-4 font-medium">
                        {vendedor.nome}
                      </td>

                      <td className="whitespace-nowrap pr-4">
                        {vendedor.cpf}
                      </td>

                      <td className="whitespace-nowrap pr-4">
                        {vendedor.telefone}
                      </td>

                      <td className="whitespace-nowrap pr-4">
                        {vendedor.cargo}
                      </td>

                      <td className="whitespace-nowrap pr-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${situacao.classe}`}
                        >
                          {situacao.texto}
                        </span>
                      </td>

                      <td className="whitespace-nowrap pr-4">
                        {formatarMoeda(vendedor.metaMensal)}
                      </td>

                      <td className="whitespace-nowrap pr-4">
                        {vendedor.metaContratos}
                      </td>

                      <td className="whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/vendedores/${vendedor.id}/editar`}
                            className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                          >
                            Editar
                          </Link>

                          <ExcluirVendedorButton
                            vendedorId={vendedor.id}
                            vendedorNome={vendedor.nome}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}