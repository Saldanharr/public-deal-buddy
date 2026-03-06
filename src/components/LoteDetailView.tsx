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
import { Layers, ScrollText, Receipt, DollarSign, Landmark, Package } from "lucide-react";

// ---- Mock data ----

interface ProdutoServicoData {
  id: string;
  tipo: string;
  subtipo: string;
  descricao: string;
}

interface ContratoData {
  id: string;
  numero: string;
  contratado: string;
  objeto: string;
  valorTotal: number;
  vigenciaFim: string;
  rescindido: boolean;
  processoId?: string;
}

interface EmpenhoData {
  id: string;
  numero: string;
  valor: number;
  elementoDespesa: string;
  dataEmpenho: string;
  assunto: string;
  emendaParlamentar: boolean;
  autorEmenda: string;
  contratoId?: string;
}

interface LiquidacaoData {
  id: string;
  numero: string;
  empenhoIds: string[];
  loteIds: string[];
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

interface LoteInfo {
  id: string;
  contratoId: string;
  produtoServicoId: string;
  quantidade: number;
  valor: number;
  previsaoEntrega: string;
  entregue: boolean;
  dataEntrega: string;
}

const mockProdutosServicos: ProdutoServicoData[] = [
  { id: "1", tipo: "Material de Consumo", subtipo: "Material de Limpeza", descricao: "Produtos de limpeza para manutenção predial" },
  { id: "2", tipo: "Serviço", subtipo: "Manutenção Predial", descricao: "Serviço de manutenção corretiva e preventiva" },
  { id: "3", tipo: "Equipamento", subtipo: "Informática", descricao: "Computadores, monitores e periféricos" },
];

const mockContratos: ContratoData[] = [
  { id: "1", numero: "CT-2024-000001", contratado: "Tech Solutions Ltda", objeto: "Manutenção de sistemas", valorTotal: 450000, vigenciaFim: "2025-01-31", rescindido: false, processoId: "1" },
  { id: "2", numero: "CT-2024-000002", contratado: "Limpeza Total S.A.", objeto: "Serviço de limpeza", valorTotal: 280000, vigenciaFim: "2025-03-09", rescindido: false, processoId: "2" },
];

const mockEmpenhos: EmpenhoData[] = [
  { id: "1", numero: "2024NE000001", valor: 150000, elementoDespesa: "339030", dataEmpenho: "2024-03-15", assunto: "Aquisição de materiais de limpeza", emendaParlamentar: true, autorEmenda: "João Silva", contratoId: "1" },
  { id: "2", numero: "2024NE000002", valor: 87500, elementoDespesa: "449052", dataEmpenho: "2024-04-20", assunto: "Aquisição de equipamentos de informática", emendaParlamentar: false, autorEmenda: "", contratoId: "1" },
  { id: "3", numero: "2024NE000003", valor: 120000, elementoDespesa: "339039", dataEmpenho: "2024-05-10", assunto: "Serviço de manutenção predial", emendaParlamentar: true, autorEmenda: "Maria Souza", contratoId: "2" },
];

const mockLiquidacoes: LiquidacaoData[] = [
  { id: "1", numero: "LIQ-2024-001", empenhoIds: ["1", "2"], loteIds: ["1"], descricao: "Liquidação referente à entrega parcial de materiais", valorTotal: 55000, dataLiquidacao: "2024-07-15" },
  { id: "2", numero: "LIQ-2024-002", empenhoIds: ["3"], loteIds: ["3"], descricao: "Liquidação de serviço de manutenção - mês de maio", valorTotal: 26000, dataLiquidacao: "2024-06-05" },
];

const mockEmendas: EmendaData[] = [
  { id: "1", codigo: "EM00001", numeroEmenda: "202400000001", tipo: "Individual", autor: "João Silva", valor: 500000, empenhoIds: ["1"] },
  { id: "2", codigo: "EM00002", numeroEmenda: "202400000002", tipo: "Bancada", autor: "Maria Souza", valor: 1200000, empenhoIds: ["2", "3"] },
];

// ---- Helpers ----

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatCurrency4 = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(value);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
};

// ---- Component ----

interface LoteDetailViewProps {
  lote: LoteInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoteDetailView = ({ lote, open, onOpenChange }: LoteDetailViewProps) => {
  if (!lote) return null;

  const produtoServico = mockProdutosServicos.find((ps) => ps.id === lote.produtoServicoId);
  const contrato = mockContratos.find((c) => c.id === lote.contratoId);

  // Empenhos vinculados ao mesmo contrato do lote
  const relatedEmpenhos = mockEmpenhos.filter((e) => e.contratoId === lote.contratoId);
  const empenhoIds = relatedEmpenhos.map((e) => e.id);

  // Liquidações vinculadas ao lote ou aos empenhos do contrato
  const relatedLiquidacoes = mockLiquidacoes.filter(
    (l) => l.loteIds.includes(lote.id) || l.empenhoIds.some((eid) => empenhoIds.includes(eid))
  );

  // Emendas vinculadas aos empenhos do contrato
  const relatedEmendas = mockEmendas.filter((em) =>
    em.empenhoIds.some((eid) => empenhoIds.includes(eid))
  );

  const totalEmpenhado = relatedEmpenhos.reduce((s, e) => s + e.valor, 0);
  const totalLiquidado = relatedLiquidacoes.reduce((s, l) => s + l.valorTotal, 0);
  const execucao = lote.valor > 0 ? Math.min(100, Math.round((totalLiquidado / lote.valor) * 100)) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Detalhes do Lote
          </DialogTitle>
          <DialogDescription>
            Visualize contrato, produto/serviço, empenhos, liquidações e emendas relacionados a este lote.
          </DialogDescription>
        </DialogHeader>

        {/* Summary */}
        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Contrato</p>
            <p className="font-semibold">{contrato?.numero || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Valor do Lote</p>
            <p className="font-semibold">{formatCurrency4(lote.valor)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Quantidade</p>
            <p className="font-semibold">{lote.quantidade.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Previsão Entrega</p>
            <p className="font-medium">{formatDate(lote.previsaoEntrega)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Status Entrega</p>
            <Badge variant={lote.entregue ? "default" : "secondary"}>
              {lote.entregue ? "Entregue" : "Pendente"}
            </Badge>
          </div>
          {lote.entregue && (
            <div>
              <p className="text-muted-foreground text-xs">Data Entrega</p>
              <p className="font-medium">{formatDate(lote.dataEntrega)}</p>
            </div>
          )}
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
          {produtoServico && (
            <div className="col-span-2 sm:col-span-4">
              <p className="text-muted-foreground text-xs">Produto/Serviço</p>
              <p className="text-sm">{produtoServico.tipo} — {produtoServico.subtipo}: {produtoServico.descricao}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contrato" className="mt-2">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="contrato" className="gap-1 text-xs sm:text-sm">
              <ScrollText className="h-3.5 w-3.5 hidden sm:block" />
              Contrato
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

          {/* Contrato */}
          <TabsContent value="contrato">
            {!contrato ? (
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
                      <TableCell className="font-medium">{contrato.numero}</TableCell>
                      <TableCell>{contrato.contratado}</TableCell>
                      <TableCell className="max-w-[180px] truncate text-sm">{contrato.objeto}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(contrato.valorTotal)}</TableCell>
                      <TableCell className="text-sm">{formatDate(contrato.vigenciaFim)}</TableCell>
                      <TableCell>
                        <Badge variant={contrato.rescindido ? "destructive" : "secondary"}>
                          {contrato.rescindido ? "Rescindido" : "Vigente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
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
                      <TableHead>Elem. Despesa</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Emenda</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedEmpenhos.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.numero}</TableCell>
                        <TableCell><Badge variant="outline">{emp.elementoDespesa}</Badge></TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">{emp.assunto}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(emp.valor)}</TableCell>
                        <TableCell>{formatDate(emp.dataEmpenho)}</TableCell>
                        <TableCell>
                          <Badge variant={emp.emendaParlamentar ? "destructive" : "secondary"}>
                            {emp.emendaParlamentar ? "Sim" : "Não"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default LoteDetailView;
