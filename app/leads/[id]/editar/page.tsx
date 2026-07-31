import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../../components/layout/Sidebar";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PageHeader from "../../../components/ui/PageHeader";

import { prisma } from "../../../lib/prisma";
import { editarLead } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatarDataParaInput(data: Date | null) {
  if (!data) {
    return "";
  }

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

export default async function EditarLeadPage({ params }: Props) {
  const { id } = await params;
  const leadId = Number(id);

  if (!Number.isInteger(leadId) || leadId <= 0) {
    notFound();
  }

  const [lead, bancos, convenios, vendedores] =
    await Promise.all([
      prisma.lead.findUnique({
        where: {
          id: leadId,
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

  const atualizarLead = editarLead.bind(null, lead.id);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title={`Editar Lead #${lead.id}`}
          subtitle="Atualize as informações do cliente."
        />

        <Card>
          <form action={atualizarLead}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Nome"
                name="nome"
                defaultValue={lead.nome}
                required
              />

              <Input
                label="CPF"
                name="cpf"
                defaultValue={lead.cpf ?? ""}
              />

              <Input
                label="Telefone"
                name="telefone"
                defaultValue={lead.telefone}
                required
              />

              <Input
                label="WhatsApp"
                name="whatsapp"
                defaultValue={lead.whatsapp ?? ""}
              />

              <Input
                label="E-mail"
                name="email"
                defaultValue={lead.email ?? ""}
                type="email"
              />

              <Input
                label="Origem"
                name="origem"
                defaultValue={lead.origem}
              />

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
                label="Produto"
                name="produto"
                defaultValue={lead.produto ?? ""}
              />

              <Input
                label="Valor solicitado"
                name="valorSolicitado"
                defaultValue={String(
                  lead.valorSolicitado ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Valor liberado"
                name="valorLiberado"
                defaultValue={String(
                  lead.valorLiberado ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Próximo contato"
                name="proximoContato"
                type="datetime-local"
                defaultValue={formatarDataParaInput(
                  lead.proximoContato,
                )}
              />

              <Input
                label="Último contato"
                name="ultimoContato"
                type="datetime-local"
                defaultValue={formatarDataParaInput(
                  lead.ultimoContato,
                )}
              />

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={lead.status}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="NOVO">Novo</option>

                  <option value="PRIMEIRO_CONTATO">
                    Primeiro contato
                  </option>

                  <option value="DOCUMENTACAO">
                    Documentação
                  </option>

                  <option value="DIGITACAO">
                    Digitação
                  </option>

                  <option value="EM_ANALISE">
                    Em análise
                  </option>

                  <option value="APROVADO">
                    Aprovado
                  </option>

                  <option value="PAGO">
                    Pago
                  </option>

                  <option value="PERDIDO">
                    Perdido
                  </option>
                </select>
              </div>
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
                defaultValue={lead.observacoes ?? ""}
                className="min-h-40 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Digite observações sobre o atendimento..."
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Link
                href={`/leads/${lead.id}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}