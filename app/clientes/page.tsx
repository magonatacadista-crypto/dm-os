import Link from "next/link";
import Sidebar from "../components/layout/Sidebar";
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
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 bg-slate-100 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold">Vendedores</h1>

            <p className="mt-2 text-gray-500">
              Total cadastrados: <strong>{totalVendedores}</strong>
              {" | "}
              Ativos: <strong>{totalAtivos}</strong>
            </p>
          </div>

          <Link
            href="/vendedores/novo"
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            + Novo Vendedor
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar vendedor..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="overflow-x-auto rounded-xl bg-white p-6 shadow-md">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Nome</th>
                <th className="py-3 text-left">CPF</th>
                <th className="py-3 text-left">Telefone</th>
                <th className="py-3 text-left">Cargo</th>
                <th className="py-3 text-left">Situação</th>
                <th className="py-3 text-left">Meta mensal</th>
                <th className="py-3 text-left">
                  Meta de contratos
                </th>
                <th className="py-3 text-center">Ações</th>
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
                      <td className="py-3 font-medium">
                        {vendedor.nome}
                      </td>

                      <td>{vendedor.cpf}</td>

                      <td>{vendedor.telefone}</td>

                      <td>{vendedor.cargo}</td>

                      <td>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${situacao.classe}`}
                        >
                          {situacao.texto}
                        </span>
                      </td>

                      <td>{formatarMoeda(vendedor.metaMensal)}</td>

                      <td>{vendedor.metaContratos}</td>

                      <td className="space-x-2 text-center">
                        <Link
                          href={`/vendedores/${vendedor.id}/editar`}
                          className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          disabled
                          title="A exclusão será implementada na próxima etapa"
                          className="cursor-not-allowed rounded bg-red-400 px-3 py-1 text-white opacity-60"
                        >
                          Excluir
                        </button>
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