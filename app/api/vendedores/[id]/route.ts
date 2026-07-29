import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function obterVendedorId(id: string) {
  const vendedorId = Number(id);

  if (!Number.isInteger(vendedorId) || vendedorId <= 0) {
    return null;
  }

  return vendedorId;
}

function textoOpcional(valor: unknown) {
  const texto = String(valor ?? "").trim();

  return texto || null;
}

function dataOpcional(valor: unknown) {
  const texto = String(valor ?? "").trim();

  if (!texto) {
    return null;
  }

  const data = new Date(`${texto}T12:00:00`);

  return Number.isNaN(data.getTime()) ? null : data;
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const vendedorId = obterVendedorId(id);

  if (!vendedorId) {
    return NextResponse.json(
      {
        mensagem: "ID do vendedor inválido.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    await prisma.vendedor.delete({
      where: {
        id: vendedorId,
      },
    });

    return NextResponse.json({
      mensagem: "Vendedor excluído com sucesso.",
    });
  } catch {
    return NextResponse.json(
      {
        mensagem:
          "Vendedor não encontrado ou não pôde ser excluído.",
      },
      {
        status: 404,
      }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const vendedorId = obterVendedorId(id);

  if (!vendedorId) {
    return NextResponse.json(
      {
        mensagem: "ID do vendedor inválido.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const body = await request.json();

    const nome = String(body.nome ?? "").trim();
    const cpf = String(body.cpf ?? "").trim();
    const telefone = String(body.telefone ?? "").trim();
    const cargo = String(body.cargo ?? "").trim();
    const situacao = String(body.situacao ?? "ATIVO").trim();

    const metaMensal = Number(body.metaMensal ?? 0);
    const metaContratos = Number(body.metaContratos ?? 0);
    const comissaoPadrao = Number(body.comissaoPadrao ?? 0);

    if (!nome || !cpf || !telefone || !cargo) {
      return NextResponse.json(
        {
          mensagem:
            "Nome, CPF, telefone e cargo são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(metaMensal) ||
      metaMensal < 0 ||
      !Number.isInteger(metaContratos) ||
      metaContratos < 0 ||
      !Number.isFinite(comissaoPadrao) ||
      comissaoPadrao < 0
    ) {
      return NextResponse.json(
        {
          mensagem:
            "Informe valores válidos para metas e comissão.",
        },
        {
          status: 400,
        }
      );
    }

    const vendedorAtualizado = await prisma.vendedor.update({
      where: {
        id: vendedorId,
      },
      data: {
        nome,
        cpf,
        rg: textoOpcional(body.rg),
        dataNascimento: dataOpcional(body.dataNascimento),
        telefone,
        whatsapp: textoOpcional(body.whatsapp),
        email: textoOpcional(body.email),
        matricula: textoOpcional(body.matricula),
        cargo,
        dataAdmissao: dataOpcional(body.dataAdmissao),
        situacao,
        metaMensal,
        metaContratos,
        comissaoPadrao,
        observacoes: textoOpcional(body.observacoes),
      },
    });

    return NextResponse.json({
      mensagem: "Vendedor atualizado com sucesso.",
      vendedor: vendedorAtualizado,
    });
  } catch (erro) {
    const mensagem =
      erro instanceof Error ? erro.message : "";

    if (
      mensagem.includes("Unique constraint") ||
      mensagem.includes("UNIQUE constraint")
    ) {
      return NextResponse.json(
        {
          mensagem:
            "Já existe outro vendedor com esse CPF ou matrícula.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        mensagem:
          "Vendedor não encontrado ou não pôde ser atualizado.",
      },
      {
        status: 404,
      }
    );
  }
}