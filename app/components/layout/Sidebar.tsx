import Link from "next/link";

const secoes = [
  {
    titulo: "Principal",
    itens: [
      {
        nome: "Dashboard",
        href: "/",
        icone: "🏠",
      },
    ],
  },
  {
    titulo: "CRM",
    itens: [
      {
        nome: "Leads",
        href: "/leads",
        icone: "🎯",
      },
      {
        nome: "Clientes",
        href: "/clientes",
        icone: "👥",
      },
      {
        nome: "Agenda",
        href: "/agenda",
        icone: "📅",
      },
    ],
  },
  {
    titulo: "Cadastros",
    itens: [
      {
        nome: "Vendedores",
        href: "/vendedores",
        icone: "👨‍💼",
      },
      {
        nome: "Supervisores",
        href: "/supervisores",
        icone: "🧑‍💼",
      },
      {
        nome: "Bancos",
        href: "/bancos",
        icone: "🏦",
      },
      {
        nome: "Convênios",
        href: "/convenios",
        icone: "📋",
      },
      {
        nome: "Produtos",
        href: "/produtos",
        icone: "💳",
      },
      {
        nome: "Parceiros",
        href: "/parceiros",
        icone: "🤝",
      },
    ],
  },
  {
    titulo: "Operações",
    itens: [
      {
        nome: "Contratos",
        href: "/contratos",
        icone: "📄",
      },
      {
        nome: "Pendências",
        href: "/pendencias",
        icone: "⚠️",
      },
      {
        nome: "Documentos",
        href: "/documentos",
        icone: "📁",
      },
    ],
  },
  {
    titulo: "Financeiro",
    itens: [
      {
        nome: "Comissões",
        href: "/comissoes",
        icone: "💰",
      },
      {
        nome: "Produção",
        href: "/producao",
        icone: "📈",
      },
    ],
  },
  {
    titulo: "Gestão",
    itens: [
      {
        nome: "Relatórios",
        href: "/relatorios",
        icone: "📊",
      },
    ],
  },
  {
    titulo: "Administração",
    itens: [
      {
        nome: "Usuários",
        href: "/usuarios",
        icone: "🔐",
      },
      {
        nome: "Configurações",
        href: "/configuracoes",
        icone: "⚙️",
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 shrink-0 overflow-y-auto bg-slate-900 p-6 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">D&M OS</h1>

        <p className="mt-1 text-sm text-slate-400">
          Gestão de crédito consignado
        </p>
      </div>

      <nav>
        <div className="space-y-7">
          {secoes.map((secao) => (
            <section key={secao.titulo}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {secao.titulo}
              </h2>

              <ul className="space-y-1">
                {secao.itens.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-blue-400"
                    >
                      <span>{item.icone}</span>
                      <span>{item.nome}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </nav>
    </aside>
  );
}