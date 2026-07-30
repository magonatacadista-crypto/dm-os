"use client";

import { useState, useTransition } from "react";

import { excluirBanco } from "./actions";

type ExcluirBancoButtonProps = {
  id: number;
  nome: string;
};

export default function ExcluirBancoButton({
  id,
  nome,
}: ExcluirBancoButtonProps) {
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, iniciarTransicao] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function confirmarExclusao() {
    setErro(null);

    iniciarTransicao(async () => {
      try {
        await excluirBanco(id);
        setConfirmando(false);
      } catch (error) {
        console.error("Erro ao excluir banco:", error);
        setErro(
          "Não foi possível excluir o banco. Ele pode estar sendo utilizado em outro cadastro.",
        );
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErro(null);
          setConfirmando(true);
        }}
        className="font-medium text-red-600 transition hover:text-red-800"
      >
        Excluir
      </button>

      {confirmando && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-exclusao-banco"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2
              id="titulo-exclusao-banco"
              className="text-lg font-semibold text-slate-900"
            >
              Excluir banco
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Tem certeza de que deseja excluir o banco{" "}
              <strong>{nome}</strong>? Essa ação não poderá ser desfeita.
            </p>

            {erro && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {erro}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                disabled={excluindo}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={excluindo}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
              >
                {excluindo ? "Excluindo..." : "Confirmar exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}