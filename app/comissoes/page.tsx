import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

import { prisma } from "../lib/prisma";

export default async function ComissoesPage() {
    const contratosPagos =
  await prisma.contrato.findMany({
    where: {
      status: "PAGO",
    },

    include: {
      produto: {
        select: {
          nome: true,
          comissaoPercentual: true,
        },
      },

      vendedor: {
        select: {
          id: true,
          nome: true,
        },
      },
    },

    orderBy: {
      dataPagamento: "desc",
    },
  });

const totalContratosPagos =
  contratosPagos.length;

const producaoPaga =
  contratosPagos.reduce(
    (total, contrato) =>
      total +
      Number(
        contrato.valorLiberado ?? 0,
      ),
    0,
  );

const comissaoCalculada =
  contratosPagos.reduce(
    (total, contrato) => {
      const valorLiberado =
        Number(
          contrato.valorLiberado ?? 0,
        );

      const percentual =
        Number(
          contrato.produto
            ?.comissaoPercentual ?? 0,
        );

      const comissao =
        valorLiberado *
        (percentual / 100);

      return total + comissao;
    },
    0,
  );

const comissoesPorVendedor =
  new Map<
    string,
    {
      nome: string;
      contratos: number;
      producao: number;
      comissao: number;
    }
  >();

for (const contrato of contratosPagos) {
  const chave = contrato.vendedor
    ? String(contrato.vendedor.id)
    : "sem-vendedor";

  const atual =
    comissoesPorVendedor.get(chave) ?? {
      nome:
        contrato.vendedor?.nome ??
        "Não atribuído",
      contratos: 0,
      producao: 0,
      comissao: 0,
    };

  const valorLiberado =
    Number(
      contrato.valorLiberado ?? 0,
    );

  const percentual =
    Number(
      contrato.produto
        ?.comissaoPercentual ?? 0,
    );

  atual.contratos += 1;
  atual.producao += valorLiberado;
  atual.comissao +=
    valorLiberado *
    (percentual / 100);

  comissoesPorVendedor.set(
    chave,
    atual,
  );
}

const vendedores =
  Array.from(
    comissoesPorVendedor.values(),
  ).sort(
    (a, b) =>
      b.comissao - a.comissao,
  );
  return (
    <div className="space-y-5">
      <PageHeader
  title="Comissões"
  subtitle="Acompanhe as comissões geradas pelos contratos pagos."
/>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs font-medium text-slate-500">
            Contratos pagos
          </p>

          <strong className="mt-2 block text-xl text-slate-900">
  {totalContratosPagos}
</strong>
        </Card>

        <Card>
          <p className="text-xs font-medium text-slate-500">
            Produção paga
          </p>

          <strong className="mt-2 block text-xl text-slate-900">
  {producaoPaga.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</strong>
        </Card>

        <Card>
          <p className="text-xs font-medium text-slate-500">
            Comissão calculada
          </p>

          <strong className="mt-2 block text-xl text-slate-900">
            <strong className="mt-2 block text-xl text-slate-900">
  {comissaoCalculada.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</strong>
          </strong>
        </Card>

        <Card>
          <p className="text-xs font-medium text-slate-500">
            Comissão paga
          </p>

          <strong className="mt-2 block text-xl text-slate-900">
            R$ 0,00
          </strong>
        </Card>
      </div>

      <Card>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Comissões por vendedor
          </h2>

          <p className="text-xs text-slate-500">
            Demonstrativo das comissões geradas no período.
          </p>
        </div>
        <Card>
  <div className="mb-4">
    <h2 className="text-base font-semibold text-slate-900">
      Detalhamento das comissões
    </h2>

    <p className="text-xs text-slate-500">
      Conferência das comissões calculadas por contrato.
    </p>
  </div>

  {contratosPagos.length === 0 ? (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
      <p className="text-sm text-slate-500">
        Nenhum contrato pago encontrado.
      </p>
    </div>
  ) : (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">
              Contrato
            </th>

            <th className="px-4 py-3 font-semibold">
              Vendedor
            </th>

            <th className="px-4 py-3 font-semibold">
              Produto
            </th>

            <th className="px-4 py-3 font-semibold">
              Valor liberado
            </th>

            <th className="px-4 py-3 font-semibold">
              Comissão %
            </th>

            <th className="px-4 py-3 font-semibold">
              Comissão
            </th>
          </tr>
        </thead>

        <tbody>
          {contratosPagos.map((contrato) => {
            const valorLiberado =
              Number(contrato.valorLiberado ?? 0);

            const percentual =
              Number(
                contrato.produto
                  ?.comissaoPercentual ?? 0,
              );

            const valorComissao =
              valorLiberado *
              (percentual / 100);

            return (
              <tr
                key={contrato.id}
                className="border-t border-slate-200"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {contrato.numero ??
                    `#${contrato.id}`}
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {contrato.vendedor?.nome ??
                    "Não atribuído"}
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {contrato.produto?.nome ??
                    "Não informado"}
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {valorLiberado.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {percentual.toLocaleString(
                    "pt-BR",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                  %
                </td>

                <td className="px-4 py-3 font-semibold text-slate-900">
                  {valorComissao.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</Card>

        {vendedores.length === 0 ? (
  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
    <p className="text-sm text-slate-500">
      Nenhuma comissão calculada.
    </p>
  </div>
) : (
  <div className="overflow-x-auto rounded-lg border border-slate-200">
    <table className="w-full text-sm">
      <thead className="bg-slate-50 text-left text-slate-600">
        <tr>
          <th className="px-4 py-3 font-semibold">
            Vendedor
          </th>

          <th className="px-4 py-3 font-semibold">
            Contratos pagos
          </th>

          <th className="px-4 py-3 font-semibold">
            Produção paga
          </th>

          <th className="px-4 py-3 font-semibold">
            Comissão
          </th>
        </tr>
      </thead>

      <tbody>
        {vendedores.map((vendedor) => (
          <tr
            key={vendedor.nome}
            className="border-t border-slate-200"
          >
            <td className="px-4 py-3 font-medium text-slate-900">
              {vendedor.nome}
            </td>

            <td className="px-4 py-3 text-slate-700">
              {vendedor.contratos}
            </td>

            <td className="px-4 py-3 text-slate-700">
              {vendedor.producao.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                },
              )}
            </td>

            <td className="px-4 py-3 font-semibold text-slate-900">
              {vendedor.comissao.toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                },
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </Card>
    </div>
  );
}
