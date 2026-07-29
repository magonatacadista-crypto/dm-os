import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(clientes);
}
export async function POST(request: Request) {
  const body = await request.json();

  const cliente = await prisma.cliente.create({
    data: {
      nome: body.nome,
      cpf: body.cpf,
      telefone: body.telefone,
      email: body.email || null,
    },
  });

  return NextResponse.json(cliente, { status: 201 });
}