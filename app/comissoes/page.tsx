import {
  desfazerPagamentoComissao,
  marcarComissaoComoPaga,
} from "./actions";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

import { prisma } from "../lib/prisma";
type Props = {
  searchParams: Promise<{
    dataInicial?: string;
    dataFinal?: string;
    vendedorId?: string;
    situacao?: string;
  }>;
};
function converterDataInicial(
  valor: string | undefined,
) {
  if (!valor) {
    return undefined;
  }

  const data = new Date(
    `${valor}T00:00:00`,
  );

  return Number.isNaN(data.getTime())
    ? undefined
    : data;
}

function converterDataFinal(
  valor: string | undefined,
) {
  if (!valor) {
    return undefined;
  }

  const data = new Date(
    `${valor}T23:59:59.999`,
  );

  return Number.isNaN(data.getTime())
    ? undefined
    : data;
}

export default async function ComissoesPage({
  searchParams,
}: Props) {
  const parametros = await searchParams;

  const dataInicialFiltro =
    converterDataInicial(
      parametros.dataInicial,
    );

  const dataFinalFiltro =
    converterDataFinal(
      parametros.dataFinal,
    );

  const vendedorIdFiltro = Number(
    parametros.vendedorId,
  );

  const vendedorIdValido =
    Number.isInteger(vendedorIdFiltro) &&
    vendedorIdFiltro > 0;

  const situacaoFiltro =
    parametros.situacao === "PAGA" ||
    parametros.situacao === "PENDENTE"
      ? parametros.situacao
      : undefined;
    const [contratosPagos, vendedoresFiltro] =
  await Promise.all([
    prisma.contrato.findMany({
      where: {
        status: "PAGO",

        ...(vendedorIdValido
          ? {
              vendedorId: vendedorIdFiltro,
            }
          : {}),

        ...(situacaoFiltro === "PAGA"
          ? {
              comissaoPaga: true,
            }
          : {}),

        ...(situacaoFiltro === "PENDENTE"
          ? {
              comissaoPaga: false,
            }
          : {}),

        ...((dataInicialFiltro ||
          dataFinalFiltro)
          ? {
              dataPagamento: {
                ...(dataInicialFiltro
                  ? {
                      gte: dataInicialFiltro,
                    }
                  : {}),

                ...(dataFinalFiltro
                  ? {
                      lte: dataFinalFiltro,
                    }
                  : {}),
              },
            }
          : {}),
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
      },
    }),
  ]);

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
    (total, contrato) =>
      total +
      Number(
        contrato.valorComissao ?? 0,
      ),
    0,
  );

const comissaoPaga =
  contratosPagos.reduce(
    (total, contrato) => {
      if (!contrato.comissaoPaga) {
        return total;
      }

      return (
        total +
        Number(
          contrato.valorComissao ?? 0,
        )
      );
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

const valorComissao =
  Number(
    contrato.valorComissao ?? 0,
  );

atual.contratos += 1;
atual.producao += valorLiberado;
atual.comissao += valorComissao;

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
<Card>
  <div className="mb-3">
    <h2 className="text-sm font-semibold text-slate-900">
      Filtros
    </h2>

    <p className="text-xs text-slate-500">
      Refine a visualização das comissões.
    </p>
  </div>

  <form
    method="GET"
    className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-6"
  >
    <div>
      <label
        htmlFor="dataInicial"
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        Data inicial
      </label>

      <input
        id="dataInicial"
        name="dataInicial"
        type="date"
        defaultValue={
          parametros.dataInicial ?? ""
        }
        className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
      />
    </div>

    <div>
      <label
        htmlFor="dataFinal"
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        Data final
      </label>

      <input
        id="dataFinal"
        name="dataFinal"
        type="date"
        defaultValue={
          parametros.dataFinal ?? ""
        }
        className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
      />
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
        defaultValue={
          vendedorIdValido
            ? String(vendedorIdFiltro)
            : ""
        }
        className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
      >
        <option value="">
          Todos os vendedores
        </option>

        {vendedoresFiltro.map((vendedor) => (
          <option
            key={vendedor.id}
            value={vendedor.id}
          >
            {vendedor.nome}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label
        htmlFor="situacao"
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        Situação
      </label>

      <select
        id="situacao"
        name="situacao"
        defaultValue={
          situacaoFiltro ?? ""
        }
        className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
      >
        <option value="">
          Todas
        </option>

        <option value="PENDENTE">
          Pendentes
        </option>

        <option value="PAGA">
          Pagas
        </option>
      </select>
    </div>

    <div>
      <button
        type="submit"
        className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
      >
        Filtrar
      </button>
    </div>

    <div>
      <a
        href="/comissoes"
        className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Limpar
      </a>
    </div>
  </form>
</Card>

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
  {comissaoPaga.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
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

  <th className="px-4 py-3 font-semibold">
    Situação
  </th>

  <th className="px-4 py-3 font-semibold">
    Ações
  </th>
</tr>
        </thead>

        <tbody>
          {contratosPagos.map((contrato) => {
            const valorLiberado =
              Number(contrato.valorLiberado ?? 0);

            const percentual =
  Number(
    contrato.comissaoPercentual ?? 0,
  );

const valorComissao =
  Number(
    contrato.valorComissao ?? 0,
  );              

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
                <td className="px-4 py-3">
  {contrato.comissaoPaga ? (
    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
      Paga
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
      Pendente
    </span>
  )}
</td>

<td className="px-4 py-3">
  {contrato.comissaoPaga ? (
  <div className="flex flex-col items-start gap-2">
    <span className="text-xs text-slate-500">
      Pago em{" "}
      {contrato.dataComissaoPaga
        ? contrato.dataComissaoPaga.toLocaleDateString(
            "pt-BR",
          )
        : "-"}
    </span>

    <form
      action={desfazerPagamentoComissao.bind(
        null,
        contrato.id,
      )}
    >
      <button
        type="submit"
        className="inline-flex h-8 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-xs font-medium text-red-600 transition hover:bg-red-50"
      >
        Desfazer pagamento
      </button>
    </form>
  </div>
) : (
  <form
    action={marcarComissaoComoPaga.bind(
      null,
      contrato.id,
    )}
  >
    <button
      type="submit"
      className="inline-flex h-8 items-center justify-center rounded-md bg-green-600 px-3 text-xs font-medium text-white transition hover:bg-green-700"
    >
      Marcar como paga
    </button>
  </form>
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
