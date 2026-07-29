import Sidebar from "../../components/layout/Sidebar";
import VendedorForm from "../../components/vendedores/VendedorForm";

export default function NovoVendedorPage() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 p-10 min-h-screen">
        <div className="mb-8">
          <h1 className="text-5xl font-bold">
            Novo Vendedor
          </h1>

          <p className="mt-2 text-gray-500">
            Cadastre um novo vendedor no sistema.
          </p>
        </div>

        <VendedorForm />
      </main>
    </div>
  );
}