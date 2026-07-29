import Link from "next/link";
import Sidebar from "../../components/layout/Sidebar";
import ClienteForm from "../../components/clientes/ClienteForm";

export default function NovoClientePage() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 bg-slate-100 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Novo Cliente</h1>

            <p className="mt-2 text-gray-600">
              Preencha os dados básicos do cliente.
            </p>
          </div>

          <Link
            href="/clientes"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>

        <ClienteForm />
      </main>
    </div>
  );
}