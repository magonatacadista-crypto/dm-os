export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        D&M OS
      </h1>

      <nav>
        <ul className="space-y-4">
          <li>🏠 Dashboard</li>
          <li>👥 Clientes</li>
          <li>💰 CRM</li>
          <li>📄 Propostas</li>
          <li>🏦 Bancos</li>
          <li>📑 Contratos</li>
          <li>📅 Agenda</li>
          <li>⚙️ Configurações</li>
        </ul>
      </nav>
    </aside>
  );
}