import Link from "next/link";

import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";

import { prisma } from "../../lib/prisma";
import { criarLead } from "../actions";

export default async function NovoLeadPage() {
  const [bancos, convenios, vendedores] = await Promise.all([
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

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title="Novo Lead"
          subtitle="Cadastre uma nova oportunidade comercial."
        />

        <Card>
          <form action={criarLead}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Nome"
                name="nome"
                placeholder="Nome completo"
                required
              />

              <Input
                label="CPF"
                name="cpf"
                placeholder="000.000.000-00"
              />

              <Input
                label="Telefone"
                name="telefone"
                placeholder="(16) 99999-9999"
                required
              />

              <Input
                label="WhatsApp"
                name="whatsapp"
                placeholder="(16) 99999-9999"
              />

              <Input
                label="E-mail"
                name="email"
                type="email"
                placeholder="cliente@email.com"
              />

              <Input
                label="Origem"
                name="origem"
                placeholder="WhatsApp"
                defaultValue="WhatsApp"
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
                  defaultValue=""
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

                {convenios.length === 0 && (
                  <p className="mt-1.5 text-sm text-amber-600">
                    Nenhum convênio ativo cadastrado.
                  </p>
                )}
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
                  defaultValue=""
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

                {bancos.length === 0 && (
                  <p className="mt-1.5 text-sm text-amber-600">
                    Nenhum banco ativo cadastrado.
                  </p>
                )}
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
                  defaultValue=""
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

                {vendedores.length === 0 && (
                  <p className="mt-1.5 text-sm text-amber-600">
                    Nenhum vendedor ativo cadastrado.
                  </p>
                )}
              </div>

              <Input
                label="Produto"
                name="produto"
                placeholder="Empréstimo Consignado"
              />

              <Input
                label="Valor solicitado"
                name="valorSolicitado"
                placeholder="0,00"
                inputMode="decimal"
              />

              <Input
                label="Valor liberado"
                name="valorLiberado"
                placeholder="0,00"
                inputMode="decimal"
              />
              <Input
  label="Próximo contato"
  name="proximoContato"
  type="datetime-local"
/>

<Input
  label="Último contato"
  name="ultimoContato"
  type="datetime-local"
/>
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
                className="min-h-32 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Digite observações sobre o atendimento..."
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Link
                href="/leads"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <Button type="submit">
                Salvar Lead
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}