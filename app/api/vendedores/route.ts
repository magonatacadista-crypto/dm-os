import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

function textoOpcional(valor: unknown) {
  if (typeof valor !== "string") {
    return null;
  }

  const texto = valor.trim();

  return texto === "" ? null : texto;
}

function dataOpcional(valor: unknown) {
  if (typeof valor !== "string" || valor.trim() === "") {
    return null;
  }

  const data = new Date(`${valor}T12:00:00`);

  return Number.isNaN(data.getTime()) ? null : data;
}

export async function GET() {
  try {
    const vendedores = await prisma.vendedor.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(vendedores);
  } catch {
    return NextResponse.json(
      {
        mensagem: "Não foi possível carregar os vendedores.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const corpo = await request.json();

    const nome =
      typeof corpo.nome === "string" ? corpo.nome.trim() : "";

    const cpf =
      typeof corpo.cpf === "string" ? corpo.cpf.trim() : "";

    const telefone =
      typeof corpo.telefone === "string"
        ? corpo.telefone.trim()
        : "";

    const cargo =
      typeof corpo.cargo === "string"
        ? corpo.cargo.trim()
        : "Vendedor";

    const situacao =
      typeof corpo.situacao === "string"
        ? corpo.situacao.trim()
        : "ATIVO";

    const metaMensal = Number(corpo.metaMensal ?? 0);
    const metaContratos = Number(corpo.metaContratos ?? 0);
    const comissaoPadrao = Number(corpo.comissaoPadrao ?? 0);

    if (!nome || !cpf || !telefone || !cargo) {
      return NextResponse.json(
        {
          mensagem:
            "Preencha nome, CPF, telefone e cargo.",
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

    const vendedor = await prisma.vendedor.create({
      data: {
        nome,
        cpf,
        rg: textoOpcional(corpo.rg),
        dataNascimento: dataOpcional(corpo.dataNascimento),
        telefone,
        whatsapp: textoOpcional(corpo.whatsapp),
        email: textoOpcional(corpo.email),
        matricula: textoOpcional(corpo.matricula),
        cargo,
        dataAdmissao: dataOpcional(corpo.dataAdmissao),
        situacao,
        metaMensal,
        metaContratos,
        comissaoPadrao,
        observacoes: textoOpcional(corpo.observacoes),
      },
    });

    return NextResponse.json(vendedor, {
      status: 201,
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
            "Já existe um vendedor com esse CPF ou matrícula.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        mensagem: "Não foi possível cadastrar o vendedor.",
      },
      {
        status: 500,
      }
    );
  }
}