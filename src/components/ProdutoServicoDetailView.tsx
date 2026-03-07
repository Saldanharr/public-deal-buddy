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
import { Card, CardContent } from "@/components/ui/card";
import {
  Layers,
  ScrollText,
  Receipt,
  SprayCan,
  Wrench,
  Monitor,
  Car,
  Cpu,
  Hammer,
  ShieldCheck,
  Truck,
  Utensils,
  Stethoscope,
  BookOpen,
  Shirt,
  Fuel,
  Building2,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface ProdutoServico {
  id: string;
  tipo: string;
  subtipo: string;
  descricao: string;
}

interface Props {
  item: ProdutoServico | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Icon mapping by tipo + subtipo keywords
const iconMap: { keywords: string[]; icon: LucideIcon; color: string }[] = [
  { keywords: ["limpeza"], icon: SprayCan, color: "text-blue-500" },
  { keywords: ["informática", "ti", "sistemas", "software"], icon: Cpu, color: "text-violet-500" },
  { keywords: ["monitor", "periférico"], icon: Monitor, color: "text-indigo-500" },
  { keywords: ["carro", "veículo", "automotivo"], icon: Car, color: "text-amber-600" },
  { keywords: ["manutenção"], icon: Wrench, color: "text-orange-500" },
  { keywords: ["construção", "obra", "predial"], icon: Building2, color: "text-stone-500" },
  { keywords: ["segurança", "vigilância"], icon: ShieldCheck, color: "text-red-500" },
  { keywords: ["transporte", "logística", "frete"], icon: Truck, color: "text-teal-500" },
  { keywords: ["alimentação", "refeição", "copa"], icon: Utensils, color: "text-yellow-600" },
  { keywords: ["saúde", "médico", "hospitalar"], icon: Stethoscope, color: "text-emerald-500" },
  { keywords: ["educação", "treinamento", "capacitação"], icon: BookOpen, color: "text-sky-500" },
  { keywords: ["vestuário", "uniforme", "fardamento"], icon: Shirt, color: "text-pink-500" },
  { keywords: ["combustível", "abastecimento"], icon: Fuel, color: "text-rose-600" },
  { keywords: ["elétrico", "energia", "eletrônico"], icon: Zap, color: "text-yellow-500" },
  { keywords: ["ferramenta"], icon: Hammer, color: "text-gray-600" },
];

export const getCategoryIcon = (tipo: string, subtipo: string): { Icon: LucideIcon; color: string } => {
  const text = `${tipo} ${subtipo}`.toLowerCase();
  const match = iconMap.find((entry) =>
    entry.keywords.some((kw) => text.includes(kw))
  );
  if (match) return { Icon: match.icon, color: match.color };

  // Fallback by tipo
  if (tipo.toLowerCase().includes("serviço")) return { Icon: Wrench, color: "text-orange-500" };
  if (tipo.toLowerCase().includes("equipamento")) return { Icon: Monitor, color: "text-indigo-500" };
  if (tipo.toLowerCase().includes("material")) return { Icon: SprayCan, color: "text-blue-500" };

  return { Icon: Layers, color: "text-muted-foreground" };
};

// Mock data for relationships
const lotesMock = [
  { id: "1", contratoId: "1", produtoServicoId: "1", quantidade: 100, valor: 25000.5, previsaoEntrega: "2024-06-30", entregue: true, dataEntrega: "2024-06-28" },
  { id: "2", contratoId: "1", produtoServicoId: "3", quantidade: 50, valor: 87500, previsaoEntrega: "2024-08-15", entregue: false, dataEntrega: "" },
  { id: "3", contratoId: "2", produtoServicoId: "2", quantidade: 1, valor: 120000.75, previsaoEntrega: "2024-09-01", entregue: false, dataEntrega: "" },
  { id: "4", contratoId: "1", produtoServicoId: "1", quantidade: 200, valor: 48000, previsaoEntrega: "2024-10-15", entregue: false, dataEntrega: "" },
];

const contratosMock = [
  { id: "1", numero: "CT-2024-000001", contratado: "Tech Solutions Ltda", objeto: "Manutenção de sistemas de informação", valorTotal: 450000 },
  { id: "2", numero: "CT-2024-000002", contratado: "Serviços Gerais S.A.", objeto: "Prestação de serviços de manutenção predial", valorTotal: 320000 },
];

const empenhosMock = [
  { id: "1", numero: "2024NE000101", contratoId: "1", valor: 150000, assunto: "Empenho para manutenção de TI" },
  { id: "2", numero: "2024NE000202", contratoId: "2", valor: 120000.75, assunto: "Empenho para manutenção predial" },
  { id: "3", numero: "2024NE000303", contratoId: "1", valor: 48000, assunto: "Empenho adicional para materiais" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(value);

const ProdutoServicoDetailView = ({ item, open, onOpenChange }: Props) => {
  if (!item) return null;

  const { Icon, color } = getCategoryIcon(item.tipo, item.subtipo);

  // Related lotes
  const relatedLotes = lotesMock.filter((l) => l.produtoServicoId === item.id);
  const relatedContratoIds = [...new Set(relatedLotes.map((l) => l.contratoId))];
  const relatedContratos = contratosMock.filter((c) => relatedContratoIds.includes(c.id));
  const relatedEmpenhos = empenhosMock.filter((e) => relatedContratoIds.includes(e.contratoId));

  const totalLotes = relatedLotes.reduce((sum, l) => sum + l.valor, 0);
  const lotesEntregues = relatedLotes.filter((l) => l.entregue).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <span className="block">{item.tipo}</span>
              <span className="block text-sm font-normal text-muted-foreground">{item.subtipo}</span>
            </div>
          </DialogTitle>
          <DialogDescription>{item.descricao || "Sem descrição cadastrada."}</DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Lotes</p>
              <p className="text-lg font-bold text-foreground">{relatedLotes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Entregues</p>
              <p className="text-lg font-bold text-foreground">{lotesEntregues}/{relatedLotes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Lotes</p>
              <p className="text-sm font-bold text-foreground">{formatCurrency(totalLotes)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Contratos</p>
              <p className="text-lg font-bold text-foreground">{relatedContratos.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="lotes" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="lotes" className="flex-1 gap-1">
              <Layers className="h-3.5 w-3.5" /> Lotes ({relatedLotes.length})
            </TabsTrigger>
            <TabsTrigger value="contratos" className="flex-1 gap-1">
              <ScrollText className="h-3.5 w-3.5" /> Contratos ({relatedContratos.length})
            </TabsTrigger>
            <TabsTrigger value="empenhos" className="flex-1 gap-1">
              <Receipt className="h-3.5 w-3.5" /> Empenhos ({relatedEmpenhos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lotes">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Prev. Entrega</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedLotes.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Nenhum lote vinculado</TableCell></TableRow>
                ) : relatedLotes.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{contratosMock.find((c) => c.id === l.contratoId)?.numero || "—"}</TableCell>
                    <TableCell>{l.quantidade.toFixed(4)}</TableCell>
                    <TableCell>{formatCurrency(l.valor)}</TableCell>
                    <TableCell>{new Date(l.previsaoEntrega + "T00:00:00").toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge variant={l.entregue ? "default" : "secondary"}>
                        {l.entregue ? "Entregue" : "Pendente"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="contratos">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Contratado</TableHead>
                  <TableHead>Objeto</TableHead>
                  <TableHead>Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedContratos.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">Nenhum contrato vinculado</TableCell></TableRow>
                ) : relatedContratos.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.numero}</TableCell>
                    <TableCell>{c.contratado}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{c.objeto}</TableCell>
                    <TableCell>{formatCurrency(c.valorTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="empenhos">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedEmpenhos.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">Nenhum empenho vinculado</TableCell></TableRow>
                ) : relatedEmpenhos.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.numero}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{e.assunto}</TableCell>
                    <TableCell>{contratosMock.find((c) => c.id === e.contratoId)?.numero || "—"}</TableCell>
                    <TableCell>{formatCurrency(e.valor)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProdutoServicoDetailView;
