"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type VendedorFormProps = {
  modo?: "cadastrar" | "editar";
  vendedorId?: number;
  dadosIniciais?: {
    nome: string;
    cpf: string;
    rg: string;
    dataNascimento: string;
    telefone: string;
    whatsapp: string;
    email: string;
    matricula: string;
    cargo: string;
    dataAdmissao: string;
    situacao: string;
    metaMensal: string;
    metaContratos: string;
    comissaoPadrao: string;
    observacoes: string;
  };
};

export default function VendedorForm({
  modo = "cadastrar",
  vendedorId,
  dadosIniciais,
}: VendedorFormProps) {
  const router = useRouter();

  const [nome, setNome] = useState(dadosIniciais?.nome ?? "");
  const [cpf, setCpf] = useState(dadosIniciais?.cpf ?? "");
  const [rg, setRg] = useState(dadosIniciais?.rg ?? "");
  const [dataNascimento, setDataNascimento] = useState(
    dadosIniciais?.dataNascimento ?? ""
  );
  const [telefone, setTelefone] = useState(
    dadosIniciais?.telefone ?? ""
  );
  const [whatsapp, setWhatsapp] = useState(
    dadosIniciais?.whatsapp ?? ""
  );
  const [email, setEmail] = useState(dadosIniciais?.email ?? "");
  const [matricula, setMatricula] = useState(
    dadosIniciais?.matricula ?? ""
  );
  const [cargo, setCargo] = useState(
    dadosIniciais?.cargo ?? "Vendedor"
  );
  const [dataAdmissao, setDataAdmissao] = useState(
    dadosIniciais?.dataAdmissao ?? ""
  );
  const [situacao, setSituacao] = useState(
    dadosIniciais?.situacao ?? "ATIVO"
  );
  const [metaMensal, setMetaMensal] = useState(
    dadosIniciais?.metaMensal ?? "0"
  );
  const [metaContratos, setMetaContratos] = useState(
    dadosIniciais?.metaContratos ?? "0"
  );
  const [comissaoPadrao, setComissaoPadrao] = useState(
    dadosIniciais?.comissaoPadrao ?? "0"
  );
  const [observacoes, setObservacoes] = useState(
    dadosIniciais?.observacoes ?? ""
  );
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  const editando = modo === "editar";

  async function salvarVendedor(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    try {
      const endereco =
        editando && vendedorId
          ? `/api/vendedores/${vendedorId}`
          : "/api/vendedores";

      const resposta = await fetch(endereco, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cpf,
          rg,
          dataNascimento,
          telefone,
          whatsapp,
          email,
          matricula,
          cargo,
          dataAdmissao,
          situacao,
          metaMensal,
          metaContratos,
          comissaoPadrao,
          observacoes,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem ??
            `Não foi possível ${
              editando ? "atualizar" : "cadastrar"
            } o vendedor.`
        );

        return;
      }

      if (editando) {
        window.alert("Vendedor atualizado com sucesso.");
        router.push("/vendedores");
        router.refresh();
        return;
      }

      setMensagem("Vendedor cadastrado com sucesso!");

      setNome("");
      setCpf("");
      setRg("");
      setDataNascimento("");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setMatricula("");
      setCargo("Vendedor");
      setDataAdmissao("");
      setSituacao("ATIVO");
      setMetaMensal("0");
      setMetaContratos("0");
      setComissaoPadrao("0");
      setObservacoes("");
    } catch {
      setMensagem(
        `Erro ao ${editando ? "atualizar" : "cadastrar"} o vendedor.`
      );
    } finally {
      setSalvando(false);
    }
  }

  const campo =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500";

  return (
    <form
      onSubmit={salvarVendedor}
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
            className={campo}
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
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">RG</label>

          <input
            type="text"
            value={rg}
            onChange={(event) => setRg(event.target.value)}
            placeholder="Digite o RG"
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Data de nascimento
          </label>

          <input
            type="date"
            value={dataNascimento}
            onChange={(event) =>
              setDataNascimento(event.target.value)
            }
            className={campo}
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
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            WhatsApp
          </label>

          <input
            type="text"
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="(00) 00000-0000"
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">E-mail</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vendedor@email.com"
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Matrícula
          </label>

          <input
            type="text"
            value={matricula}
            onChange={(event) => setMatricula(event.target.value)}
            placeholder="Ex.: VEND001"
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Cargo</label>

          <input
            type="text"
            value={cargo}
            onChange={(event) => setCargo(event.target.value)}
            required
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Data de admissão
          </label>

          <input
            type="date"
            value={dataAdmissao}
            onChange={(event) =>
              setDataAdmissao(event.target.value)
            }
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Situação
          </label>

          <select
            value={situacao}
            onChange={(event) => setSituacao(event.target.value)}
            className={campo}
          >
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="AFASTADO">Afastado</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Meta mensal
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={metaMensal}
            onChange={(event) =>
              setMetaMensal(event.target.value)
            }
            placeholder="0,00"
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Meta de contratos
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={metaContratos}
            onChange={(event) =>
              setMetaContratos(event.target.value)
            }
            className={campo}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Comissão padrão (%)
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={comissaoPadrao}
            onChange={(event) =>
              setComissaoPadrao(event.target.value)
            }
            placeholder="0,00"
            className={campo}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Observações
          </label>

          <textarea
            value={observacoes}
            onChange={(event) =>
              setObservacoes(event.target.value)
            }
            placeholder="Informações adicionais sobre o vendedor"
            rows={4}
            className={campo}
          />
        </div>
      </div>

      {mensagem && (
        <p className="mt-6 font-medium">{mensagem}</p>
      )}

      <div className="mt-8 flex justify-end gap-3">
        <Link
          href="/vendedores"
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
              ? "Salvar alterações"
              : "Salvar vendedor"}
        </button>
      </div>
    </form>
  );
}