import Link from "next/link";

import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";

import { criarLead } from "../actions";

export default function NovoLeadPage() {
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

              <Input
                label="Convênio"
                name="convenio"
                placeholder="INSS"
              />

              <Input
                label="Banco"
                name="banco"
                placeholder="Banco PAN"
              />

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