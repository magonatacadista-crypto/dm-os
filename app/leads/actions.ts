"use server";

import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";

export async function criarLead(formData: FormData) {
  const nome = String(formData.get("nome") ?? "");
  const cpf = String(formData.get("cpf") ?? "");
  const telefone = String(formData.get("telefone") ?? "");
  const whatsapp = String(formData.get("whatsapp") ?? "");
  const email = String(formData.get("email") ?? "");
  const origem = String(formData.get("origem") ?? "WhatsApp");
  const convenio = String(formData.get("convenio") ?? "");
  const banco = String(formData.get("banco") ?? "");
  const produto = String(formData.get("produto") ?? "");
  const observacoes = String(formData.get("observacoes") ?? "");

  const valorSolicitadoTexto = String(
    formData.get("valorSolicitado") ?? "0"
  ).replace(",", ".");

  const valorLiberadoTexto = String(
    formData.get("valorLiberado") ?? "0"
  ).replace(",", ".");

  await prisma.lead.create({
    data: {
      nome,
      cpf: cpf || null,
      telefone,
      whatsapp: whatsapp || null,
      email: email || null,
      origem,
      convenio: convenio || null,
      banco: banco || null,
      produto: produto || null,
      valorSolicitado: Number(valorSolicitadoTexto),
      valorLiberado: Number(valorLiberadoTexto),
      observacoes: observacoes || null,
    },
  });

  redirect("/leads");
}

export async function editarLead(id: number, formData: FormData) {
  const nome = String(formData.get("nome") ?? "");
  const cpf = String(formData.get("cpf") ?? "");
  const telefone = String(formData.get("telefone") ?? "");
  const whatsapp = String(formData.get("whatsapp") ?? "");
  const email = String(formData.get("email") ?? "");
  const origem = String(formData.get("origem") ?? "");
  const convenio = String(formData.get("convenio") ?? "");
  const banco = String(formData.get("banco") ?? "");
  const produto = String(formData.get("produto") ?? "");
  const status = String(formData.get("status") ?? "");
  const observacoes = String(formData.get("observacoes") ?? "");

  const valorSolicitadoTexto = String(
    formData.get("valorSolicitado") ?? "0"
  ).replace(",", ".");

  const valorLiberadoTexto = String(
    formData.get("valorLiberado") ?? "0"
  ).replace(",", ".");

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
      origem,
      convenio: convenio || null,
      banco: banco || null,
      produto: produto || null,
      status,
      valorSolicitado: Number(valorSolicitadoTexto),
      valorLiberado: Number(valorLiberadoTexto),
      observacoes: observacoes || null,
    },
  });

  redirect(`/leads/${id}`);
}