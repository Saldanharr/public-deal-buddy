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
import { Receipt, FileText, DollarSign, Landmark } from "lucide-react";

// ---- Shared mock data (same IDs used across pages) ----

interface EmpenhoData {
  id: string;
  numero: string;
  valor: number;
  elementoDespesa: string;
  dataEmpenho: string;
  assunto: string;
  emendaParlamentar: boolean;
  autorEmenda: string;
  processoId?: string;
}

interface ProcessoData {
  id: string;
  nup: string;
  dataCriacao: string;
  departamentoGestor: string;
  sigla: string;
  assunto: string;
  interessado: string;
}

interface LiquidacaoData {
  id: string;
  numero: string;
  empenhoIds: string[];
  descricao: string;
  valorTotal: number;
  dataLiquidacao: string;
}

interface EmendaInfo {
  id: string;
  anoEmenda: string;
  tipo: string;
  codigo: string;
  numeroEmenda: string;
  cargoAutor: string;
  autor: string;
  objeto: string;
  unidadeGestora: string;
  valor: number;
  empenhoIds: string[];
}

// Mock data - mirrors other pages
const mockEmpenhos: EmpenhoData[] = [
  {
    id: "1",
    numero: "2024NE000123",
    valor: 150000.0,
    elementoDespesa: "339039",
    dataEmpenho: "2024-03-15",
    assunto: "Aquisição de material de consumo para manutenção predial",
    emendaParlamentar: false,
    autorEmenda: "",
    processoId: "1",
  },
  {
    id: "2",
    numero: "2024NE000456",
    valor: 87500.5,
    elementoDespesa: "449052",
    dataEmpenho: "2024-04-20",
    assunto: "Aquisição de equipamentos de informática",
    emendaParlamentar: true,
    autorEmenda: "Dep. João Silva",
    processoId: "1",
  },
  {
    id: "3",
    numero: "2024NE000789",
    valor: 320000.0,
    elementoDespesa: "339037",
    dataEmpenho: "2024-05-10",
    assunto: "Contratação de serviço de limpeza e conservação",
    emendaParlamentar: false,
    autorEmenda: "",
    processoId: "2",
  },
];

const mockProcessos: ProcessoData[] = [
  {
    id: "1",
    nup: "00100000001",
    dataCriacao: "2024-01-10",
    departamentoGestor: "DLOG",
    sigla: "PROC-001",
    assunto: "Aquisição de materiais e equipamentos",
    interessado: "Departamento de Logística",
  },
  {
    id: "2",
    nup: "00100000002",
    dataCriacao: "2024-02-15",
    departamentoGestor: "DTIC",
    sigla: "PROC-002",
    assunto: "Contratação de serviços continuados",
    interessado: "Departamento de TIC",
  },
];

const mockLiquidacoes: LiquidacaoData[] = [
  {
    id: "1",
    numero: "LIQ-2024-001",
    empenhoIds: ["1", "2"],
    descricao: "Liquidação referente à entrega parcial de materiais e equipamentos",
    valorTotal: 55000.0,
    dataLiquidacao: "2024-07-15",
  },
  {
    id: "2",
    numero: "LIQ-2024-002",
    empenhoIds: ["3"],
    descricao: "Liquidação de serviço de limpeza - mês de maio",
    valorTotal: 26000.0,
    dataLiquidacao: "2024-06-05",
  },
];

// ---- Helpers ----

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
};

// ---- Component ----

interface EmendaDetailViewProps {
  emenda: EmendaInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmendaDetailView = ({ emenda, open, onOpenChange }: EmendaDetailViewProps) => {
  if (!emenda) return null;

  // Get related empenhos
  const relatedEmpenhos = mockEmpenhos.filter((e) =>
    emenda.empenhoIds.includes(e.id)
  );

  // Get related processos (via empenhos)
  const processoIds = [...new Set(relatedEmpenhos.map((e) => e.processoId).filter(Boolean))];
  const relatedProcessos = mockProcessos.filter((p) => processoIds.includes(p.id));

  // Get related liquidações (via empenhos)
  const empenhoIdSet = new Set(emenda.empenhoIds);
  const relatedLiquidacoes = mockLiquidacoes.filter((l) =>
    l.empenhoIds.some((eid) => empenhoIdSet.has(eid))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            Detalhes da Emenda — {emenda.codigo}
          </DialogTitle>
          <DialogDescription>
            Visualize os processos, empenhos e liquidações relacionados a esta emenda parlamentar.
          </DialogDescription>
        </DialogHeader>

        {/* Emenda summary card */}
        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Nº Emenda</p>
            <p className="font-semibold">{emenda.numeroEmenda}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Tipo</p>
            <Badge variant="secondary">{emenda.tipo}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Autor</p>
            <p className="font-medium">{emenda.autor}</p>
            <p className="text-xs text-muted-foreground">{emenda.cargoAutor}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Valor</p>
            <p className="font-semibold text-primary">{formatCurrency(emenda.valor)}</p>
          </div>
          <div className="col-span-2 sm:col-span-4">
            <p className="text-muted-foreground text-xs">Objeto</p>
            <p className="text-sm">{emenda.objeto || "—"}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="empenhos" className="mt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="processos" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Processos ({relatedProcessos.length})
            </TabsTrigger>
            <TabsTrigger value="empenhos" className="gap-1.5">
              <Receipt className="h-3.5 w-3.5" />
              Empenhos ({relatedEmpenhos.length})
            </TabsTrigger>
            <TabsTrigger value="liquidacoes" className="gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              Liquidações ({relatedLiquidacoes.length})
            </TabsTrigger>
          </TabsList>

          {/* Processos Tab */}
          <TabsContent value="processos">
            {relatedProcessos.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                Nenhum processo vinculado a esta emenda.
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>NUP</TableHead>
                      <TableHead>Sigla</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Depto. Gestor</TableHead>
                      <TableHead>Interessado</TableHead>
                      <TableHead>Data Criação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedProcessos.map((proc) => (
                      <TableRow key={proc.id}>
                        <TableCell className="font-medium">{proc.nup}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{proc.sigla}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{proc.assunto}</TableCell>
                        <TableCell>{proc.departamentoGestor}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{proc.interessado}</TableCell>
                        <TableCell>{formatDate(proc.dataCriacao)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Empenhos Tab */}
          <TabsContent value="empenhos">
            {relatedEmpenhos.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                Nenhum empenho vinculado a esta emenda.
              </div>
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

          {/* Liquidações Tab */}
          <TabsContent value="liquidacoes">
            {relatedLiquidacoes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                Nenhuma liquidação vinculada a esta emenda.
              </div>
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
                            {liq.empenhoIds
                              .filter((eid) => empenhoIdSet.has(eid))
                              .map((eid) => {
                                const emp = mockEmpenhos.find((e) => e.id === eid);
                                return (
                                  <Badge key={eid} variant="outline" className="text-xs">
                                    {emp?.numero ?? eid}
                                  </Badge>
                                );
                              })}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate text-sm">
                          {liq.descricao}
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(liq.valorTotal)}</TableCell>
                        <TableCell>{formatDate(liq.dataLiquidacao)}</TableCell>
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

export default EmendaDetailView;
