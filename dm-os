import Link from "next/link";
import Sidebar from "../components/layout/Sidebar";

export default function ClientesPage() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-10 bg-slate-100 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold">Clientes</h1>

          <Link
            href="/clientes/novo"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            + Novo Cliente
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">
            Nenhum cliente cadastrado.
          </p>
        </div>
      </main>
    </div>
  );
}