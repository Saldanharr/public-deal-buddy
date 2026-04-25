import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Layers, Receipt, ScrollText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmpenhoRef {
  id: string;
  numero: string;
  valor: number;
}

interface LoteRef {
  id: string;
  descricao: string;
  contratoNumero: string;
}

interface LoteQuantidade {
  loteId: string;
  quantidade: number;
}

interface Liquidacao {
  id: string;
  numero: string;
  empenhoIds: string[];
  lotesQuantidades: LoteQuantidade[];
  descricao: string;
  valorTotal: number;
  dataLiquidacao: string;
}

interface LiquidacaoDetailViewProps {
  liquidacao: Liquidacao | null;
  empenhos: EmpenhoRef[];
  lotes: LoteRef[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return format(new Date(`${dateStr}T00:00:00`), "dd/MM/yyyy", { locale: ptBR });
};

const LiquidacaoDetailView = ({ liquidacao, empenhos, lotes, open, onOpenChange }: LiquidacaoDetailViewProps) => {
  if (!liquidacao) return null;

  const relatedEmpenhos = empenhos.filter((emp) => liquidacao.empenhoIds.includes(emp.id));
  const relatedLotes = liquidacao.lotesQuantidades.map((lq) => ({
    ...lq,
    lote: lotes.find((lote) => lote.id === lq.loteId),
  }));
  const totalEmpenhado = relatedEmpenhos.reduce((sum, emp) => sum + emp.valor, 0);
  const contratos = Array.from(new Set(relatedLotes.map((item) => item.lote?.contratoNumero).filter(Boolean)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Detalhes da Liquidação
          </DialogTitle>
          <DialogDescription>
            Visualize empenhos, lotes e contratos relacionados a esta liquidação.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Nº Liquidação</p>
            <p className="font-semibold">{liquidacao.numero}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Valor Total</p>
            <p className="font-semibold">{formatCurrency(liquidacao.valorTotal)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Data</p>
            <p className="font-medium">{formatDate(liquidacao.dataLiquidacao)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Contratos</p>
            <p className="font-medium">{contratos.length || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Empenhos</p>
            <p className="font-medium">{relatedEmpenhos.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Total Empenhado</p>
            <p className="font-medium">{formatCurrency(totalEmpenhado)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Lotes</p>
            <p className="font-medium">{relatedLotes.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Quantidade Total</p>
            <p className="font-medium">
              {liquidacao.lotesQuantidades.reduce((sum, lq) => sum + lq.quantidade, 0).toFixed(2)}
            </p>
          </div>
        </div>

        <Tabs defaultValue="geral" className="mt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="geral" className="gap-1 text-xs sm:text-sm">
              <ScrollText className="h-3.5 w-3.5 hidden sm:block" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="empenhos" className="gap-1 text-xs sm:text-sm">
              <Receipt className="h-3.5 w-3.5 hidden sm:block" />
              Empenhos ({relatedEmpenhos.length})
            </TabsTrigger>
            <TabsTrigger value="lotes" className="gap-1 text-xs sm:text-sm">
              <Layers className="h-3.5 w-3.5 hidden sm:block" />
              Lotes ({relatedLotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <div className="rounded-lg border p-4 space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Descrição</p>
                <p className="font-medium">{liquidacao.descricao || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Contratos vinculados</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {contratos.length > 0 ? (
                    contratos.map((contrato) => <Badge key={contrato} variant="outline">{contrato}</Badge>)
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="empenhos">
            {relatedEmpenhos.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Nenhum empenho vinculado.</div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Nº Empenho</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedEmpenhos.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.numero}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(emp.valor)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="lotes">
            {relatedLotes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Nenhum lote vinculado.</div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Lote</TableHead>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedLotes.map((item) => (
                      <TableRow key={item.loteId}>
                        <TableCell className="font-medium">{item.lote?.descricao || "—"}</TableCell>
                        <TableCell>
                          {item.lote?.contratoNumero ? <Badge variant="outline">{item.lote.contratoNumero}</Badge> : "—"}
                        </TableCell>
                        <TableCell>{item.quantidade.toFixed(2)}</TableCell>
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

export default LiquidacaoDetailView;
