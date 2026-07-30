import Link from "next/link";

import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

const modulos = [
  {
    titulo: "🏦 Bancos",
    descricao: "Cadastre e gerencie os bancos utilizados nas operações.",
    href: "/configuracoes/bancos",
  },
  {
    titulo: "🏛 Convênios",
    descricao: "Gerencie os convênios disponíveis.",
    href: "/configuracoes/convenios",
  },
  {
    titulo: "💳 Produtos",
    descricao: "Cadastre os produtos financeiros.",
    href: "/configuracoes/produtos",
  },
  {
    titulo: "🌐 Origens",
    descricao: "Controle as origens dos Leads.",
    href: "/configuracoes/origens",
  },
  {
    titulo: "👥 Usuários",
    descricao: "Gerencie os usuários do sistema.",
    href: "/configuracoes/usuarios",
  },
  {
    titulo: "🔐 Perfis de Acesso",
    descricao: "Controle permissões e níveis de acesso.",
    href: "/configuracoes/perfis",
  },
];

export default function ConfiguracoesPage() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 bg-slate-100 p-10">
        <PageHeader
          title="Configurações"
          subtitle="Administração geral do D&M OS"
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modulos.map((modulo) => (
            <Link key={modulo.href} href={modulo.href}>
              <Card>
                <h2 className="text-xl font-semibold text-slate-800">
                  {modulo.titulo}
                </h2>

                <p className="mt-3 text-sm text-slate-600">
                  {modulo.descricao}
                </p>

                <div className="mt-6 text-sm font-semibold text-blue-600">
                  Acessar →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}