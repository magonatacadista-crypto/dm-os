import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function obterClienteId(id: string) {
  const clienteId = Number(id);

  if (!Number.isInteger(clienteId) || clienteId <= 0) {
    return null;
  }

  return clienteId;
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const clienteId = obterClienteId(id);

  if (!clienteId) {
    return NextResponse.json(
      { mensagem: "ID do cliente inválido." },
      { status: 400 }
    );
  }

  try {
    await prisma.cliente.delete({
      where: {
        id: clienteId,
      },
    });

    return NextResponse.json({
      mensagem: "Cliente excluído com sucesso.",
    });
  } catch {
    return NextResponse.json(
      { mensagem: "Cliente não encontrado ou não pôde ser excluído." },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const clienteId = obterClienteId(id);

  if (!clienteId) {
    return NextResponse.json(
      { mensagem: "ID do cliente inválido." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const nome = String(body.nome ?? "").trim();
    const cpf = String(body.cpf ?? "").trim();
    const telefone = String(body.telefone ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (!nome || !cpf || !telefone) {
      return NextResponse.json(
        {
          mensagem:
            "Nome, CPF e telefone são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: {
        id: clienteId,
      },
      data: {
        nome,
        cpf,
        telefone,
        email: email || null,
      },
    });

    return NextResponse.json({
      mensagem: "Cliente atualizado com sucesso.",
      cliente: clienteAtualizado,
    });
  } catch {
    return NextResponse.json(
      {
        mensagem:
          "Cliente não encontrado ou não pôde ser atualizado.",
      },
      { status: 404 }
    );
  }
}