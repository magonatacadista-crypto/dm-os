import Link from "next/link";
export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        D&M OS
      </h1>

      <nav>
        <ul className="space-y-4">

  <li>
    <Link href="/" className="hover:text-blue-400">
      🏠 Dashboard
    </Link>
  </li>

  <li>
    <Link href="/clientes" className="hover:text-blue-400">
      👥 Clientes
    </Link>
  </li>

  <li>
    <Link href="/crm" className="hover:text-blue-400">
      💰 CRM
    </Link>
  </li>

  <li>
    <Link href="/propostas" className="hover:text-blue-400">
      📄 Propostas
    </Link>
  </li>

  <li>
    <Link href="/bancos" className="hover:text-blue-400">
      🏦 Bancos
    </Link>
  </li>

  <li>
    <Link href="/contratos" className="hover:text-blue-400">
      📑 Contratos
    </Link>
  </li>

  <li>
    <Link href="/agenda" className="hover:text-blue-400">
      📅 Agenda
    </Link>
  </li>

  <li>
    <Link href="/configuracoes" className="hover:text-blue-400">
      ⚙️ Configurações
    </Link>
  </li>

</ul>
      </nav>
    </aside>
  );
}