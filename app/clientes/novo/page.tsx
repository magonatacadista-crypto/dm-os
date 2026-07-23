import Link from "next/link";
import Sidebar from "../../components/layout/Sidebar";

export default function NovoClientePage() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-slate-100 p-10">
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

        <form className="rounded-xl bg-white p-6 shadow-md">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block font-medium">Nome completo</label>
              <input
                type="text"
                placeholder="Digite o nome completo"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Telefone</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">E-mail</label>
              <input
                type="email"
                placeholder="cliente@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}