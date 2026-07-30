import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Loading from "../components/ui/Loading";
import PageHeader from "../components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";

export default function UiPage() {
  return (
    <main className="min-h-screen space-y-6 bg-slate-100 p-10">
      <PageHeader
        title="Biblioteca de Componentes"
        subtitle="Componentes reutilizáveis do D&M OS"
        action={<Button>Novo Registro</Button>}
      />

      <Card>
        <h2 className="mb-4 text-xl font-semibold">
          Botões
        </h2>

        <div className="flex flex-wrap gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="success">Sucesso</Button>
          <Button variant="warning">Aviso</Button>
          <Button variant="danger">Excluir</Button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">
          Badges
        </h2>

        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Ativo</Badge>
          <Badge variant="danger">Inativo</Badge>
          <Badge variant="warning">Pendente</Badge>
          <Badge variant="info">Em análise</Badge>
          <Badge>Padrão</Badge>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">
          Campos de formulário
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Nome completo"
            name="nome"
            placeholder="Digite o nome"
          />

          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="nome@empresa.com.br"
            helperText="Use um e-mail válido."
          />

          <Input
            label="Telefone"
            name="telefone"
            placeholder="(16) 99999-9999"
          />

          <Input
            label="Campo com erro"
            name="erro"
            placeholder="Digite uma informação"
            error="Este campo é obrigatório."
          />

          <Input
            label="Campo desabilitado"
            name="desabilitado"
            value="Não pode ser alterado"
            disabled
            readOnly
          />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">
          Tabela
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>Marcos Gonçalves</TableCell>
              <TableCell>marcos@exemplo.com</TableCell>
              <TableCell>(16) 99999-9999</TableCell>
              <TableCell>
                <Badge variant="success">Ativo</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="secondary">
                  Editar
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Maria Oliveira</TableCell>
              <TableCell>maria@exemplo.com</TableCell>
              <TableCell>(16) 98888-8888</TableCell>
              <TableCell>
                <Badge variant="warning">Pendente</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="secondary">
                  Editar
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>João Ferreira</TableCell>
              <TableCell>joao@exemplo.com</TableCell>
              <TableCell>(16) 97777-7777</TableCell>
              <TableCell>
                <Badge variant="danger">Inativo</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="secondary">
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">
          Estado vazio
        </h2>

        <EmptyState
          title="Nenhum cliente encontrado"
          description="Cadastre o primeiro cliente para começar a utilizar este módulo."
          icon={
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-2xl">
              👤
            </div>
          }
          action={<Button>Novo cliente</Button>}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">
          Carregamento
        </h2>

        <Loading text="Carregando informações..." />
      </Card>
    </main>
  );
}