import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollText, Receipt, DollarSign, Landmark, FileText, Package } from "lucide-react";

// ---- Mock data ----

interface ContratoData {
  id: string;
  numero: string;
  contratado: string;
  objeto: string;
  processoId: string;
  valorTotal: number;
  dataContrato: string;
  vigenciaFim: string;
  rescindido: boolean;
}

interface EmpenhoData {
  id: string;
  numero: string;
  valor: number;
  elementoDespesa: string;
  dataEmpenho: string;
  assunto: string;
  processoId?: string;
  contratoId?: string;
}

interface LiquidacaoData {
  id: string;
  numero: string;
  empenhoIds: string[];
  descricao: string;
  valorTotal: number;
  dataLiquidacao: string;
}

interface EmendaData {
  id: string;
  codigo: string;
  numeroEmenda: string;
  tipo: string;
  autor: string;
  valor: number;
  empenhoIds: string[];
}

interface LoteData {
  id: string;
  numero: string;
  descricao: string;
  contratoId: string;
  valor: number;
}

interface ProcessoInfo {
  id: string;
  nup: string;
  dataCriacao: string;
  departamentoGestor: string;
  sigla: string;
  assunto: string;
  interessado: string;
  prioritario: boolean;
  prioridade: string;
}

const mockContratos: ContratoData[] = [
  {
    id: "1",
    numero: "CT-2024-000001",
    contratado: "Tech Solutions Ltda",
    objeto: "Manutenção de sistemas de informação",
    processoId: "1",
    valorTotal: 450000,
    dataContrato: "2024-01-20",
    vigenciaFim: "2025-01-31",
    rescindido: false,
  },
  {
    id: "2",
    numero: "CT-2024-000002",
    contratado: "Limpeza Total S.A.",
    objeto: "Serviço de limpeza e conservação predial",
    processoId: "1",
    valorTotal: 280000,
    dataContrato: "2024-03-10",
    vigenciaFim: "2025-03-09",
    rescindido: false,
  },
];

const mockEmpenhos: EmpenhoData[] = [
  {
    id: "1",
    numero: "2024NE000123",
    valor: 150000,
    elementoDespesa: "339039",
    dataEmpenho: "2024-03-15",
    assunto: "Aquisição de material de consumo para manutenção predial",
    processoId: "1",
    contratoId: "1",
  },
  {
    id: "2",
    numero: "2024NE000456",
    valor: 87500.5,
    elementoDespesa: "449052",
    dataEmpenho: "2024-04-20",
    assunto: "Aquisição de equipamentos de informática",
    processoId: "1",
    contratoId: "1",
  },
  {
    id: "3",
    numero: "2024NE000789",
    valor: 320000,
    elementoDespesa: "339037",
    dataEmpenho: "2024-05-10",
    assunto: "Contratação de serviço de limpeza e conservação",
    processoId: "2",
    contratoId: "2",
  },
];

const mockLiquidacoes: LiquidacaoData[] = [
  {
    id: "1",
    numero: "LIQ-2024-001",
    empenhoIds: ["1", "2"],
    descricao: "Liquidação referente à entrega parcial de materiais",
    valorTotal: 55000,
    dataLiquidacao: "2024-07-15",
  },
  {
    id: "2",
    numero: "LIQ-2024-002",
    empenhoIds: ["3"],
    descricao: "Liquidação de serviço de limpeza - mês de maio",
    valorTotal: 26000,
    dataLiquidacao: "2024-06-05",
  },
];

const mockEmendas: EmendaData[] = [
  {
    id: "1",
    codigo: "EM00001",
    numeroEmenda: "202400000001",
    tipo: "Individual",
    autor: "João Silva",
    valor: 500000,
    empenhoIds: ["1"],
  },
  {
    id: "2",
    codigo: "EM00002",
    numeroEmenda: "202400000002",
    tipo: "Bancada",
    autor: "Maria Souza",
    valor: 1200000,
    empenhoIds: ["2", "3"],
  },
];

const mockLotes: LoteData[] = [
  { id: "1", numero: "LT-001", descricao: "Material de Limpeza", contratoId: "1", valor: 15000 },
  { id: "2", numero: "LT-002", descricao: "Equipamentos de Informática", contratoId: "1", valor: 87500 },
  { id: "3", numero: "LT-003", descricao: "Serviço de Manutenção Predial", contratoId: "2", valor: 120000 },
];

// ---- Helpers ----

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
};

// ---- Component ----

interface ProcessoDetailViewProps {
  processo: ProcessoInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProcessoDetailView = ({ processo, open, onOpenChange }: ProcessoDetailViewProps) => {
  if (!processo) return null;

  const relatedContratos = mockContratos.filter((c) => c.processoId === processo.id);
  const contratoIds = new Set(relatedContratos.map((c) => c.id));

  const relatedEmpenhos = mockEmpenhos.filter((e) => e.processoId === processo.id);
  const empenhoIds = new Set(relatedEmpenhos.map((e) => e.id));

  const relatedLiquidacoes = mockLiquidacoes.filter((l) =>
    l.empenhoIds.some((eid) => empenhoIds.has(eid))
  );

  const relatedEmendas = mockEmendas.filter((em) =>
    em.empenhoIds.some((eid) => empenhoIds.has(eid))
  );

  const relatedLotes = mockLotes.filter((l) => contratoIds.has(l.contratoId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalhes do Processo — {processo.sigla || processo.nup}
          </DialogTitle>
          <DialogDescription>
            Visualize contratos, empenhos, liquidações, emendas e lotes relacionados a este processo.
          </DialogDescription>
        </DialogHeader>

        {/* Process summary */}
        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">NUP</p>
            <p className="font-semibold">{processo.nup}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Sigla</p>
            <Badge variant="outline">{processo.sigla || "—"}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Depto. Gestor</p>
            <p className="font-medium">{processo.departamentoGestor}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Data Criação</p>
            <p className="font-medium">{formatDate(processo.dataCriacao)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground text-xs">Interessado</p>
            <p className="text-sm">{processo.interessado || "—"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground text-xs">Assunto</p>
            <p className="text-sm">{processo.assunto || "—"}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contratos" className="mt-2">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="contratos" className="gap-1 text-xs sm:text-sm">
              <ScrollText className="h-3.5 w-3.5 hidden sm:block" />
              Contratos ({relatedContratos.length})
            </TabsTrigger>
            <TabsTrigger value="empenhos" className="gap-1 text-xs sm:text-sm">
              <Receipt className="h-3.5 w-3.5 hidden sm:block" />
              Empenhos ({relatedEmpenhos.length})
            </TabsTrigger>
            <TabsTrigger value="liquidacoes" className="gap-1 text-xs sm:text-sm">
              <DollarSign className="h-3.5 w-3.5 hidden sm:block" />
              Liquidações ({relatedLiquidacoes.length})
            </TabsTrigger>
            <TabsTrigger value="emendas" className="gap-1 text-xs sm:text-sm">
              <Landmark className="h-3.5 w-3.5 hidden sm:block" />
              Emendas ({relatedEmendas.length})
            </TabsTrigger>
            <TabsTrigger value="lotes" className="gap-1 text-xs sm:text-sm">
              <Package className="h-3.5 w-3.5 hidden sm:block" />
              Lotes ({relatedLotes.length})
            </TabsTrigger>
          </TabsList>

          {/* Contratos */}
          <TabsContent value="contratos">
            {relatedContratos.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Nenhum contrato vinculado.</div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Nº Contrato</TableHead>
                      <TableHead>Contratado</TableHead>
                      <TableHead>Objeto</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Vigência</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedContratos.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.numero}</TableCell>
                        <TableCell>{c.contratado}</TableCell>
                        <TableCell className="max-w-[180px] truncate text-sm">{c.objeto}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(c.valorTotal)}</TableCell>
                        <TableCell className="text-sm">{formatDate(c.vigenciaFim)}</TableCell>
                        <TableCell>
                          <Badge variant={c.rescindido ? "destructive" : "secondary"}>
                            {c.rescindido ? "Rescindido" : "Vigente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Empenhos */}
          <TabsContent value="empenhos">
            {relatedEmpenhos.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Nenhum empenho vinculado.</div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Nº Empenho</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Elem. Despesa</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Execução</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedEmpenhos.map((emp) => {
                      const execucao = Math.floor(Math.random() * 101);
                      const temSaldo = execucao < 100;
                      return (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{emp.numero}</TableCell>
                          <TableCell className="max-w-[180px] truncate text-sm">{emp.assunto}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(emp.valor)}</TableCell>
                          <TableCell>{emp.elementoDespesa}</TableCell>
                          <TableCell>
                            <Badge variant={temSaldo ? "secondary" : "destructive"}>
                              {temSaldo ? "Com Saldo" : "Sem Saldo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-[80px]">
                              <Progress value={execucao} className="h-2 w-14" />
                              <span className="text-xs text-muted-foreground">{execucao}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(emp.dataEmpenho)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Liquidações */}
          <TabsContent value="liquidacoes">
            {relatedLiquidacoes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Nenhuma liquidação vinculada.</div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Nº Liquidação</TableHead>
                      <TableHead>Empenhos</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedLiquidacoes.map((liq) => (
                      <TableRow key={liq.id}>
                        <TableCell className="font-medium">{liq.numero}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {liq.empenhoIds.map((eid) => {
                              const emp = mockEmpenhos.find((e) => e.id === eid);
                              return (
                                <Badge key={eid} variant="outline" className="text-xs">
                                  {emp?.numero ?? eid}
                                </Badge>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">{liq.descricao}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(liq.valorTotal)}</TableCell>
                        <TableCell>{formatDate(liq.dataLiquidacao)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Emendas */}
          <TabsContent value="emendas">
            {relatedEmendas.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Nenhuma emenda vinculada.</div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Código</TableHead>
                      <TableHead>Nº Emenda</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedEmendas.map((em) => (
                      <TableRow key={em.id}>
                        <TableCell className="font-medium">{em.codigo}</TableCell>
                        <TableCell>{em.numeroEmenda}</TableCell>
                        <TableCell><Badge variant="secondary">{em.tipo}</Badge></TableCell>
                        <TableCell>{em.autor}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(em.valor)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Lotes */}
          <TabsContent value="lotes">
            {relatedLotes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Nenhum lote vinculado.</div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Nº Lote</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedLotes.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.numero}</TableCell>
                        <TableCell>{l.descricao}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(l.valor)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessoDetailView;
