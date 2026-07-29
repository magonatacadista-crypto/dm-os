"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ExcluirVendedorButtonProps = {
  vendedorId: number;
  vendedorNome: string;
};

export default function ExcluirVendedorButton({
  vendedorId,
  vendedorNome,
}: ExcluirVendedorButtonProps) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);

  async function excluirVendedor() {
    const confirmou = window.confirm(
      `Deseja realmente excluir o vendedor "${vendedorNome}"?`
    );

    if (!confirmou) {
      return;
    }

    setExcluindo(true);

    try {
      const resposta = await fetch(
        `/api/vendedores/${vendedorId}`,
        {
          method: "DELETE",
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        window.alert(
          dados.mensagem ??
            "Não foi possível excluir o vendedor."
        );

        return;
      }

      window.alert("Vendedor excluído com sucesso.");
      router.refresh();
    } catch {
      window.alert("Erro ao excluir o vendedor.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <button
      type="button"
      onClick={excluirVendedor}
      disabled={excluindo}
      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {excluindo ? "Excluindo..." : "Excluir"}
    </button>
  );
}