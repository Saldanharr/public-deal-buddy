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
import { Receipt, ScrollText, DollarSign, Landmark, FileText } from "lucide-react";

// ---- Mock data ----

interface ContratoData {
  id: string;
  numero: string;
  contratado: string;
  objeto: string;
  valorTotal: number;
  vigenciaFim: string;
  rescindido: boolean;
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

interface ProcessoData {
  id: string;
  nup: string;
  sigla: string;
  assunto: string;
  departamentoGestor: string;
}

interface EmpenhoInfo {
  id: string;
  numero: string;
  valor: number;
  elementoDespesa: string;
  dataEmpenho: string;
  assunto: string;
  emendaParlamentar: boolean;
  autorEmenda: string;
  contratoId?: string;
  processoId?: string;
}

const mockContratos: ContratoData[] = [
  { id: "1", numero: "CT-2024-000001", contratado: "Tech Solutions Ltda", objeto: "Manutenção de sistemas", valorTotal: 450000, vigenciaFim: "2025-01-31", rescindido: false },
  { id: "2", numero: "CT-2024-000002", contratado: "Limpeza Total S.A.", objeto: "Serviço de limpeza", valorTotal: 280000, vigenciaFim: "2025-03-09", rescindido: false },
];

const mockProcessos: ProcessoData[] = [
  { id: "1", nup: "12345678901", sigla: "PC-2024/001", assunto: "Aquisição de materiais", departamentoGestor: "DLOG" },
  { id: "2", nup: "98765432100", sigla: "PC-2024/002", assunto: "Contratação de serviços", departamentoGestor: "DTEC" },
];

const mockLiquidacoes: LiquidacaoData[] = [
  { id: "1", numero: "LIQ-2024-001", empenhoIds: ["1", "2"], descricao: "Liquidação referente à entrega parcial de materiais", valorTotal: 55000, dataLiquidacao: "2024-07-15" },
  { id: "2", numero: "LIQ-2024-002", empenhoIds: ["3"], descricao: "Liquidação de serviço de limpeza - mês de maio", valorTotal: 26000, dataLiquidacao: "2024-06-05" },
];

const mockEmendas: EmendaData[] = [
  { id: "1", codigo: "EM00001", numeroEmenda: "202400000001", tipo: "Individual", autor: "João Silva", valor: 500000, empenhoIds: ["1"] },
  { id: "2", codigo: "EM00002", numeroEmenda: "202400000002", tipo: "Bancada", autor: "Maria Souza", valor: 1200000, empenhoIds: ["2", "3"] },
];

// Mapeamento empenho -> contrato/processo
const empenhoRelations: Record<string, { contratoId?: string; processoId?: string }> = {
  "1": { contratoId: "1", processoId: "1" },
  "2": { contratoId: "1", processoId: "1" },
  "3": { contratoId: "2", processoId: "2" },
};

// ---- Helpers ----

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
};

// ---- Component ----

interface EmpenhoDetailViewProps {
  empenho: EmpenhoInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmpenhoDetailView = ({ empenho, open, onOpenChange }: EmpenhoDetailViewProps) => {
  if (!empenho) return null;

  const relations = empenhoRelations[empenho.id] || {};

  const relatedContrato = relations.contratoId
    ? mockContratos.find((c) => c.id === relations.contratoId)
    : undefined;

  const relatedProcesso = relations.processoId
    ? mockProcessos.find((p) => p.id === relations.processoId)
    : undefined;

  const relatedLiquidacoes = mockLiquidacoes.filter((l) =>
    l.empenhoIds.includes(empenho.id)
  );

  const relatedEmendas = mockEmendas.filter((em) =>
    em.empenhoIds.includes(empenho.id)
  );

  const totalLiquidado = relatedLiquidacoes.reduce((s, l) => s + l.valorTotal, 0);
  const execucao = empenho.valor > 0 ? Math.min(100, Math.round((totalLiquidado / empenho.valor) * 100)) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Detalhes do Empenho — {empenho.numero}
          </DialogTitle>
          <DialogDescription>
            Visualize contrato, processo, liquidações e emendas relacionados a este empenho.
          </DialogDescription>
        </DialogHeader>

        {/* Empenho summary */}
        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Número</p>
            <p className="font-semibold">{empenho.numero}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Valor</p>
            <p className="font-semibold">{formatCurrency(empenho.valor)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Elem. Despesa</p>
            <p className="font-medium">{empenho.elementoDespesa}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Data</p>
            <p className="font-medium">{formatDate(empenho.dataEmpenho)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Emenda Parlamentar</p>
            <Badge variant={empenho.emendaParlamentar ? "destructive" : "secondary"}>
              {empenho.emendaParlamentar ? "Sim" : "Não"}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Execução</p>
            <div className="flex items-center gap-2">
              <Progress value={execucao} className="h-2 w-16" />
              <span className="text-xs font-medium">{execucao}%</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Total Liquidado</p>
            <p className="font-medium">{formatCurrency(totalLiquidado)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Saldo</p>
            <p className="font-medium">{formatCurrency(empenho.valor - totalLiquidado)}</p>
          </div>
          <div className="col-span-2 sm:col-span-4">
            <p className="text-muted-foreground text-xs">Assunto</p>
            <p className="text-sm">{empenho.assunto || "—"}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contrato" className="mt-2">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="contrato" className="gap-1 text-xs sm:text-sm">
              <ScrollText className="h-3.5 w-3.5 hidden sm:block" />
              Contrato
            </TabsTrigger>
            <TabsTrigger value="processo" className="gap-1 text-xs sm:text-sm">
              <FileText className="h-3.5 w-3.5 hidden sm:block" />
              Processo
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

          {/* Contrato */}
          <TabsContent value="contrato">
            {!relatedContrato ? (
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
                    <TableRow>
                      <TableCell className="font-medium">{relatedContrato.numero}</TableCell>
                      <TableCell>{relatedContrato.contratado}</TableCell>
                      <TableCell className="max-w-[180px] truncate text-sm">{relatedContrato.objeto}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(relatedContrato.valorTotal)}</TableCell>
                      <TableCell className="text-sm">{formatDate(relatedContrato.vigenciaFim)}</TableCell>
                      <TableCell>
                        <Badge variant={relatedContrato.rescindido ? "destructive" : "secondary"}>
                          {relatedContrato.rescindido ? "Rescindido" : "Vigente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Processo */}
          <TabsContent value="processo">
            {!relatedProcesso ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Nenhum processo vinculado.</div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>NUP</TableHead>
                      <TableHead>Sigla</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Depto. Gestor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{relatedProcesso.nup}</TableCell>
                      <TableCell><Badge variant="outline">{relatedProcesso.sigla}</Badge></TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">{relatedProcesso.assunto}</TableCell>
                      <TableCell>{relatedProcesso.departamentoGestor}</TableCell>
                    </TableRow>
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
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedLiquidacoes.map((liq) => (
                      <TableRow key={liq.id}>
                        <TableCell className="font-medium">{liq.numero}</TableCell>
                        <TableCell className="max-w-[250px] truncate text-sm">{liq.descricao}</TableCell>
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

export default EmpenhoDetailView;
