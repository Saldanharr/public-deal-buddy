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
import { ScrollText, Receipt, DollarSign, Landmark, Package, AlertTriangle } from "lucide-react";

// ---- Mock data ----

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

interface ContratoInfo {
  id: string;
  numero: string;
  contratado: string;
  objeto: string;
  processoId: string;
  nupContrato: string;
  valorTotal: number;
  dataContrato: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  dataPublicacao: string;
  rescindido: boolean;
}

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

interface ContratoDetailViewProps {
  contrato: ContratoInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContratoDetailView = ({ contrato, open, onOpenChange }: ContratoDetailViewProps) => {
  if (!contrato) return null;

  const relatedEmpenhos = mockEmpenhos.filter((e) => e.contratoId === contrato.id);
  const empenhoIds = new Set(relatedEmpenhos.map((e) => e.id));

  const relatedLiquidacoes = mockLiquidacoes.filter((l) =>
    l.empenhoIds.some((eid) => empenhoIds.has(eid))
  );

  const relatedEmendas = mockEmendas.filter((em) =>
    em.empenhoIds.some((eid) => empenhoIds.has(eid))
  );

  const relatedLotes = mockLotes.filter((l) => l.contratoId === contrato.id);

  const totalEmpenhado = relatedEmpenhos.reduce((sum, e) => sum + e.valor, 0);
  const totalLiquidado = relatedLiquidacoes.reduce((sum, l) => sum + l.valorTotal, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            Detalhes do Contrato — {contrato.numero}
          </DialogTitle>
          <DialogDescription>
            Visualize lotes, empenhos, liquidações e emendas relacionados a este contrato.
          </DialogDescription>
        </DialogHeader>

        {/* Contract summary */}
        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Número</p>
            <p className="font-semibold">{contrato.numero}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Contratado</p>
            <p className="font-medium">{contrato.contratado}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Valor Total</p>
            <p className="font-semibold">{formatCurrency(contrato.valorTotal)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Status</p>
            <Badge variant={contrato.rescindido ? "destructive" : "secondary"}>
              {contrato.rescindido ? "Rescindido" : "Vigente"}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Data Contrato</p>
            <p className="font-medium">{formatDate(contrato.dataContrato)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Vigência</p>
            <p className="font-medium">{formatDate(contrato.vigenciaInicio)} — {formatDate(contrato.vigenciaFim)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Total Empenhado</p>
            <p className="font-medium">{formatCurrency(totalEmpenhado)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Total Liquidado</p>
            <p className="font-medium">{formatCurrency(totalLiquidado)}</p>
          </div>
          <div className="col-span-2 sm:col-span-4">
            <p className="text-muted-foreground text-xs">Objeto</p>
            <p className="text-sm">{contrato.objeto || "—"}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lotes" className="mt-2">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="lotes" className="gap-1 text-xs sm:text-sm">
              <Package className="h-3.5 w-3.5 hidden sm:block" />
              Lotes ({relatedLotes.length})
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
          </TabsList>

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
                      <TableHead>Execução</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedEmpenhos.map((emp) => {
                      const liqTotal = mockLiquidacoes
                        .filter((l) => l.empenhoIds.includes(emp.id))
                        .reduce((s, l) => s + l.valorTotal, 0);
                      const execucao = emp.valor > 0 ? Math.min(100, Math.round((liqTotal / emp.valor) * 100)) : 0;
                      return (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{emp.numero}</TableCell>
                          <TableCell className="max-w-[180px] truncate text-sm">{emp.assunto}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(emp.valor)}</TableCell>
                          <TableCell>{emp.elementoDespesa}</TableCell>
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContratoDetailView;
