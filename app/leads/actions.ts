"use server";

import { redirect } from "next/navigation";

import { StatusLead } from "../generated/prisma/client";
import { registrarHistoricoLead } from "../lib/historicoLead";
import { prisma } from "../lib/prisma";

function converterValorMonetario(
  valor: FormDataEntryValue | null,
) {
  const texto = String(valor ?? "0")
    .trim()
    .replace(/\./g, "")
    .replace(",", ".");

  const numero = Number(texto);

  return Number.isFinite(numero) ? numero : 0;
}

function converterIdOpcional(
  valor: FormDataEntryValue | null,
) {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero <= 0) {
    return null;
  }

  return numero;
}

function converterDataOpcional(
  valor: FormDataEntryValue | null,
) {
  const texto = String(valor ?? "").trim();

  if (!texto) {
    return null;
  }

  const data = new Date(texto);

  if (Number.isNaN(data.getTime())) {
    return null;
  }

  return data;
}

function converterStatusLead(
  valor: FormDataEntryValue | null,
): StatusLead {
  switch (String(valor ?? "").trim()) {
    case "PRIMEIRO_CONTATO":
      return StatusLead.PRIMEIRO_CONTATO;

    case "DOCUMENTACAO":
      return StatusLead.DOCUMENTACAO;

    case "DIGITACAO":
      return StatusLead.DIGITACAO;

    case "EM_ANALISE":
      return StatusLead.EM_ANALISE;

    case "APROVADO":
      return StatusLead.APROVADO;

    case "PAGO":
      return StatusLead.PAGO;

    case "PERDIDO":
      return StatusLead.PERDIDO;

    case "NOVO":
    default:
      return StatusLead.NOVO;
  }
}

async function buscarBancoAtivo(
  bancoId: number | null,
) {
  if (!bancoId) {
    return null;
  }

  const banco = await prisma.banco.findFirst({
    where: {
      id: bancoId,
      ativo: true,
    },
    select: {
      nome: true,
    },
  });

  if (!banco) {
    throw new Error(
      "O banco selecionado é inválido ou está inativo.",
    );
  }

  return banco.nome;
}

async function buscarConvenioAtivo(
  convenioId: number | null,
) {
  if (!convenioId) {
    return null;
  }

  const convenio = await prisma.convenio.findFirst({
    where: {
      id: convenioId,
      ativo: true,
    },
    select: {
      nome: true,
    },
  });

  if (!convenio) {
    throw new Error(
      "O convênio selecionado é inválido ou está inativo.",
    );
  }

  return convenio.nome;
}

async function buscarProdutoAtivo(
  produtoId: number | null,
) {
  if (!produtoId) {
    return null;
  }

  const produto = await prisma.produto.findFirst({
    where: {
      id: produtoId,
      ativo: true,
    },
    select: {
      nome: true,
    },
  });

  if (!produto) {
    throw new Error(
      "O produto selecionado é inválido ou está inativo.",
    );
  }

  return produto.nome;
}

async function validarVendedorAtivo(
  vendedorId: number | null,
) {
  if (!vendedorId) {
    return;
  }

  const vendedor = await prisma.vendedor.findFirst({
    where: {
      id: vendedorId,
      situacao: "ATIVO",
    },
    select: {
      id: true,
    },
  });

  if (!vendedor) {
    throw new Error(
      "O vendedor selecionado é inválido ou está inativo.",
    );
  }
}

export async function criarLead(formData: FormData) {
  const nome = String(
    formData.get("nome") ?? "",
  ).trim();

  const cpf = String(
    formData.get("cpf") ?? "",
  ).trim();

  const telefone = String(
    formData.get("telefone") ?? "",
  ).trim();

  const whatsapp = String(
    formData.get("whatsapp") ?? "",
  ).trim();

  const email = String(
    formData.get("email") ?? "",
  ).trim();

  const origem = String(
    formData.get("origem") ?? "WhatsApp",
  ).trim();

  const observacoes = String(
    formData.get("observacoes") ?? "",
  ).trim();

  const bancoId = converterIdOpcional(
    formData.get("bancoId"),
  );

  const convenioId = converterIdOpcional(
    formData.get("convenioId"),
  );

  const vendedorId = converterIdOpcional(
    formData.get("vendedorId"),
  );

  const produtoId = converterIdOpcional(
    formData.get("produtoId"),
  );

  const proximoContato = converterDataOpcional(
    formData.get("proximoContato"),
  );

  if (!nome || !telefone) {
    throw new Error(
      "Nome e telefone são obrigatórios.",
    );
  }

  const [nomeBanco, nomeConvenio, nomeProduto] =
    await Promise.all([
      buscarBancoAtivo(bancoId),
      buscarConvenioAtivo(convenioId),
      buscarProdutoAtivo(produtoId),
    ]);

  await validarVendedorAtivo(vendedorId);

  const lead = await prisma.lead.create({
    data: {
      nome,
      cpf: cpf || null,
      telefone,
      whatsapp: whatsapp || null,
      email: email || null,
      origem: origem || "WhatsApp",

      banco: nomeBanco,
      bancoId,

      convenio: nomeConvenio,
      convenioId,

      produto: nomeProduto,
      produtoId,

      vendedorId,

      valorSolicitado: converterValorMonetario(
        formData.get("valorSolicitado"),
      ),

      valorLiberado: converterValorMonetario(
        formData.get("valorLiberado"),
      ),

      observacoes: observacoes || null,
      proximoContato,
    },
  });

  await registrarHistoricoLead({
    leadId: lead.id,
    tipo: "LEAD_CRIADO",
    descricao: "Lead cadastrado no sistema.",
  });

  redirect("/leads");
}

export async function editarLead(
  id: number,
  formData: FormData,
) {
  const nome = String(
    formData.get("nome") ?? "",
  ).trim();

  const cpf = String(
    formData.get("cpf") ?? "",
  ).trim();

  const telefone = String(
    formData.get("telefone") ?? "",
  ).trim();

  const whatsapp = String(
    formData.get("whatsapp") ?? "",
  ).trim();

  const email = String(
    formData.get("email") ?? "",
  ).trim();

  const origem = String(
    formData.get("origem") ?? "",
  ).trim();

  const status = converterStatusLead(
    formData.get("status"),
  );

  const observacoes = String(
    formData.get("observacoes") ?? "",
  ).trim();

  const bancoId = converterIdOpcional(
    formData.get("bancoId"),
  );

  const convenioId = converterIdOpcional(
    formData.get("convenioId"),
  );

  const vendedorId = converterIdOpcional(
    formData.get("vendedorId"),
  );

  const produtoId = converterIdOpcional(
    formData.get("produtoId"),
  );

  const proximoContato = converterDataOpcional(
    formData.get("proximoContato"),
  );

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Lead inválido.");
  }

  if (!nome || !telefone) {
    throw new Error(
      "Nome e telefone são obrigatórios.",
    );
  }

  const [nomeBanco, nomeConvenio, nomeProduto] =
    await Promise.all([
      buscarBancoAtivo(bancoId),
      buscarConvenioAtivo(convenioId),
      buscarProdutoAtivo(produtoId),
    ]);

  await validarVendedorAtivo(vendedorId);

  await prisma.lead.update({
    where: {
      id,
    },
    data: {
      nome,
      cpf: cpf || null,
      telefone,
      whatsapp: whatsapp || null,
      email: email || null,
      origem: origem || "WhatsApp",

      banco: nomeBanco,
      bancoId,

      convenio: nomeConvenio,
      convenioId,

      produto: nomeProduto,
      produtoId,

      vendedorId,
      status,

      valorSolicitado: converterValorMonetario(
        formData.get("valorSolicitado"),
      ),

      valorLiberado: converterValorMonetario(
        formData.get("valorLiberado"),
      ),

      observacoes: observacoes || null,
      proximoContato,
    },
  });

  redirect(`/leads/${id}`);
}