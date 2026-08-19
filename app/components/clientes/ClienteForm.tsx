"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ClienteFormProps = {
  modo?: "cadastrar" | "editar";
  clienteId?: number;
  dadosIniciais?: {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;

  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};
};

export default function ClienteForm({
  modo = "cadastrar",
  clienteId,
  dadosIniciais,
}: ClienteFormProps) {
  const router = useRouter();

  const [nome, setNome] = useState(dadosIniciais?.nome ?? "");
  const [cpf, setCpf] = useState(dadosIniciais?.cpf ?? "");
  const [telefone, setTelefone] = useState(dadosIniciais?.telefone ?? "");
  const [email, setEmail] = useState(dadosIniciais?.email ?? "");
  const [cep, setCep] = useState(dadosIniciais?.cep ?? "");
const [logradouro, setLogradouro] = useState(
  dadosIniciais?.logradouro ?? "",
);
const [numero, setNumero] = useState(
  dadosIniciais?.numero ?? "",
);
const [complemento, setComplemento] = useState(
  dadosIniciais?.complemento ?? "",
);
const [bairro, setBairro] = useState(
  dadosIniciais?.bairro ?? "",
);
const [cidade, setCidade] = useState(
  dadosIniciais?.cidade ?? "",
);
const [estado, setEstado] = useState(
  dadosIniciais?.estado ?? "",
);
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  const editando = modo === "editar";

  async function salvarCliente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    try {
      const endereco =
        editando && clienteId
          ? `/api/clientes/${clienteId}`
          : "/api/clientes";

      const resposta = await fetch(endereco, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  nome,
  cpf,
  telefone,
  email,
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
}),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem ??
            `Não foi possível ${
              editando ? "atualizar" : "cadastrar"
            } o cliente.`
        );

        return;
      }

      if (editando) {
        window.alert("Cliente atualizado com sucesso.");
        router.push("/clientes");
        router.refresh();
        return;
      }

      setMensagem("Cliente cadastrado com sucesso!");

      setNome("");
      setCpf("");
      setTelefone("");
      setEmail("");
      setCep("");
setLogradouro("");
setNumero("");
setComplemento("");
setBairro("");
setCidade("");
setEstado("");
    } catch {
      setMensagem(
        `Erro ao ${editando ? "atualizar" : "cadastrar"} o cliente.`
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={salvarCliente}
      className="rounded-xl bg-white p-6 shadow-md"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            Nome completo
          </label>

          <input
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Digite o nome completo"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">CPF</label>

          <input
            type="text"
            value={cpf}
            onChange={(event) => setCpf(event.target.value)}
            placeholder="000.000.000-00"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Telefone
          </label>

          <input
            type="text"
            value={telefone}
            onChange={(event) => setTelefone(event.target.value)}
            placeholder="(00) 00000-0000"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">E-mail</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="cliente@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
        <div>
  <label className="mb-2 block font-medium">
    CEP
  </label>

  <input
    type="text"
    value={cep}
    onChange={(event) => setCep(event.target.value)}
    placeholder="00000-000"
    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

<div>
  <label className="mb-2 block font-medium">
    Logradouro
  </label>

  <input
    type="text"
    value={logradouro}
    onChange={(event) =>
      setLogradouro(event.target.value)
    }
    placeholder="Rua, Avenida, Alameda..."
    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

<div>
  <label className="mb-2 block font-medium">
    Número
  </label>

  <input
    type="text"
    value={numero}
    onChange={(event) =>
      setNumero(event.target.value)
    }
    placeholder="Número"
    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

<div>
  <label className="mb-2 block font-medium">
    Complemento
  </label>

  <input
    type="text"
    value={complemento}
    onChange={(event) =>
      setComplemento(event.target.value)
    }
    placeholder="Apartamento, bloco, fundos..."
    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

<div>
  <label className="mb-2 block font-medium">
    Bairro
  </label>

  <input
    type="text"
    value={bairro}
    onChange={(event) =>
      setBairro(event.target.value)
    }
    placeholder="Bairro"
    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

<div>
  <label className="mb-2 block font-medium">
    Cidade
  </label>

  <input
    type="text"
    value={cidade}
    onChange={(event) =>
      setCidade(event.target.value)
    }
    placeholder="Cidade"
    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>

<div>
  <label className="mb-2 block font-medium">
    Estado
  </label>

  <input
    type="text"
    value={estado}
    onChange={(event) =>
      setEstado(event.target.value)
    }
    placeholder="SP"
    maxLength={2}
    className="w-full rounded-lg border border-gray-300 px-4 py-3 uppercase outline-none focus:border-blue-500"
  />
</div>
      </div>

      {mensagem && (
        <p className="mt-6 font-medium">{mensagem}</p>
      )}

      <div className="mt-8 flex justify-end gap-3">
        <Link
          href="/clientes"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 hover:bg-gray-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={salvando}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {salvando
            ? "Salvando..."
            : editando
              ? "Salvar Alterações"
              : "Salvar Cliente"}
        </button>
      </div>
    </form>
  );
}