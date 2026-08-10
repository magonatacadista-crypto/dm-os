"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  FileText,
  FolderOpen,
  Handshake,
  LayoutDashboard,
  Pin,
  PinOff,
  Settings,
  Target,
  TriangleAlert,
  UserRoundCog,
  Users,
} from "lucide-react";

const secoes = [
  {
    titulo: "Principal",
    itens: [
      {
        nome: "Dashboard",
        href: "/",
        icone: LayoutDashboard,
      },
    ],
  },
  {
    titulo: "CRM",
    itens: [
      {
        nome: "Leads",
        href: "/leads",
        icone: Target,
      },
      {
        nome: "Clientes",
        href: "/clientes",
        icone: Users,
      },
      {
        nome: "Agenda",
        href: "/agenda",
        icone: CalendarDays,
      },
      {
        nome: "Pipeline",
        href: "/pipeline",
        icone: BarChart3,
      },
    ],
  },
  {
    titulo: "Equipe",
    itens: [
      {
        nome: "Vendedores",
        href: "/vendedores",
        icone: BriefcaseBusiness,
      },
      {
        nome: "Supervisores",
        href: "/supervisores",
        icone: UserRoundCog,
      },
    ],
  },
  {
  titulo: "Operações",
  itens: [
    {
      nome: "Propostas",
      href: "/propostas",
      icone: ClipboardList,
    },
    {
      nome: "Contratos",
      href: "/contratos",
      icone: FileText,
    },
      {
        nome: "Pendências",
        href: "/pendencias",
        icone: TriangleAlert,
      },
      {
        nome: "Documentos",
        href: "/documentos",
        icone: FolderOpen,
      },
      {
        nome: "Parceiros",
        href: "/parceiros",
        icone: Handshake,
      },
    ],
  },
  {
    titulo: "Financeiro",
    itens: [
      {
        nome: "Comissões",
        href: "/comissoes",
        icone: CircleDollarSign,
      },
      {
        nome: "Produção",
        href: "/producao",
        icone: BarChart3,
      },
    ],
  },
  {
    titulo: "Gestão",
    itens: [
      {
        nome: "Relatórios",
        href: "/relatorios",
        icone: ClipboardList,
      },
    ],
  },
  {
    titulo: "Administração",
    itens: [
      {
        nome: "Configurações",
        href: "/configuracoes",
        icone: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [fixada, setFixada] = useState(false);

  function itemAtivo(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  const mostrarTextos = fixada;

  return (
    <aside
      className={`
        group
        sticky
        top-0
        z-40
        h-screen
        shrink-0
        overflow-x-hidden
        overflow-y-auto
        bg-slate-900
        text-white
        transition-all
        duration-300
        ease-in-out
        ${
          fixada
            ? "w-64"
            : "w-20 hover:w-64"
        }
      `}
    >
      <div className="flex min-h-full flex-col px-3 py-5">
        <div className="mb-6">
          <div className="flex h-12 items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold">
              D&M
            </div>

            <div
              className={`
                ml-3
                min-w-0
                whitespace-nowrap
                transition-opacity
                duration-200
                ${
                  mostrarTextos
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }
              `}
            >
              <h1 className="text-lg font-bold">
                D&M OS
              </h1>

              <p className="text-xs text-slate-400">
                Crédito Consignado
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setFixada(
                  (valorAtual) => !valorAtual,
                )
              }
              title={
                fixada
                  ? "Desafixar menu"
                  : "Fixar menu aberto"
              }
              className={`
                ml-auto
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-slate-800
                hover:text-white
                ${
                  fixada
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }
              `}
            >
              {fixada ? (
                <PinOff
                  size={17}
                  aria-hidden="true"
                />
              ) : (
                <Pin
                  size={17}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1">
          <div className="space-y-5">
            {secoes.map((secao) => (
              <section key={secao.titulo}>
                <div className="mb-2 h-5 overflow-hidden">
                  <h2
                    className={`
                      whitespace-nowrap
                      px-3
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                      transition-opacity
                      duration-200
                      ${
                        mostrarTextos
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                  >
                    {secao.titulo}
                  </h2>
                </div>

                <ul className="space-y-1">
                  {secao.itens.map((item) => {
                    const ativo =
                      itemAtivo(item.href);

                    const Icone = item.icone;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={item.nome}
                          className={`
                            relative
                            flex
                            h-11
                            items-center
                            rounded-lg
                            transition
                            ${
                              ativo
                                ? "bg-blue-600 text-white"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }
                          `}
                        >
                          {ativo && (
                            <span className="absolute left-0 h-6 w-1 rounded-r bg-white" />
                          )}

                          <span className="flex w-14 shrink-0 items-center justify-center">
                            <Icone
                              size={20}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                          </span>

                          <span
                            className={`
                              whitespace-nowrap
                              text-sm
                              font-medium
                              transition-opacity
                              duration-200
                              ${
                                mostrarTextos
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }
                            `}
                          >
                            {item.nome}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </nav>

        <div className="mt-6 border-t border-slate-800 pt-4">
          <div className="flex h-10 items-center">
            <div className="flex w-14 shrink-0 items-center justify-center">
              <Settings
                size={17}
                className="text-slate-500"
                aria-hidden="true"
              />
            </div>

            <div
              className={`
                whitespace-nowrap
                text-xs
                text-slate-500
                transition-opacity
                duration-200
                ${
                  mostrarTextos
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }
              `}
            >
              D&M OS • v1.0
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}