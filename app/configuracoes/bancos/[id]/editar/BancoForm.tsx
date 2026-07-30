"use client";

import Link from "next/link";
import { useActionState } from "react";

import Sidebar from "../../../../components/layout/Sidebar";
import Card from "../../../../components/ui/Card";
import PageHeader from "../../../../components/ui/PageHeader";

import {
  atualizarBanco,
  type BancoActionState,
} from "../../actions";

type BancoFormProps = {
  banco: {
    id: number;
    nome: string;
    codigo: string | null;
    ativo: boolean;
  };
};

const estadoInicial: BancoActionState = {
  erro: null,
};

export default function BancoForm({ banco }: BancoFormProps) {
  const [estado, formAction, enviando] = useActionState(
    atualizarBanco,
    estadoInicial,
  );

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 bg-slate-100 p-10">
        <PageHeader
          title="Editar Banco"
          subtitle="Atualize os dados do banco selecionado."
        />

        <Card>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="id" value={banco.id} />

            {estado.erro && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {estado.erro}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nome do Banco
                </label>

                <input
                  id="nome"
                  name="nome"
                  type="text"
                  defaultValue={banco.nome}
                  required
                  disabled={enviando}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="codigo"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Código
                </label>

                <input
                  id="codigo"
                  name="codigo"
                  type="text"
                  defaultValue={banco.codigo ?? ""}
                  disabled={enviando}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="ativo"
                name="ativo"
                type="checkbox"
                defaultChecked={banco.ativo}
                disabled={enviando}
                className="h-4 w-4 rounded border-slate-300"
              />

              <label
                htmlFor="ativo"
                className="text-sm text-slate-700"
              >
                Banco ativo
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={enviando}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {enviando ? "Salvando..." : "Salvar alterações"}
              </button>

              <Link
                href="/configuracoes/bancos"
                className={`rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 ${
                  enviando ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Cancelar
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}