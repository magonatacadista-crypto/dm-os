"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ExcluirClienteButtonProps = {
  clienteId: number;
  clienteNome: string;
};

export default function ExcluirClienteButton({
  clienteId,
  clienteNome,
}: ExcluirClienteButtonProps) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);

  async function excluirCliente() {
    const confirmou = window.confirm(
      `Deseja realmente excluir o cliente "${clienteNome}"?`
    );

    if (!confirmou) {
      return;
    }

    setExcluindo(true);

    try {
      const resposta = await fetch(`/api/clientes/${clienteId}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        const dados = await resposta.json();

        window.alert(
          dados.mensagem ?? "Não foi possível excluir o cliente."
        );

        return;
      }

      router.refresh();
    } catch {
      window.alert("Erro de conexão ao excluir o cliente.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <button
      type="button"
      onClick={excluirCliente}
      disabled={excluindo}
      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {excluindo ? "Excluindo..." : "Excluir"}
    </button>
  );
}