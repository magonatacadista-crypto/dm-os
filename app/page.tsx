import Sidebar from "./components/layout/Sidebar";
import StatsCard from "./components/dashboard/StatsCard";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-10 bg-slate-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-4 gap-6">
          <StatsCard titulo="Clientes" valor="1.248" />
          <StatsCard titulo="Propostas" valor="84" />
          <StatsCard titulo="Contratos" valor="27" />
          <StatsCard titulo="Produção" valor="R$ 685 mil" />
        </div>
      </main>
    </div>
  );
}