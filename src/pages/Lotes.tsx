import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Layers, Eye, PlusCircle, X } from "lucide-react";
import LoteDetailView from "@/components/LoteDetailView";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProdutoServico {
  id: string;
  tipo: string;
  subtipo: string;
  descricao: string;
}

interface ContratoRef {
  id: string;
  numero: string;
}

export interface LoteItem {
  id: string;
  produtoServicoId: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Lote {
  id: string;
  contratoId: string;
  itens: LoteItem[];
  previsaoEntrega: string;
  entregue: boolean;
  dataEntrega: string;
}

export const produtosServicos: ProdutoServico[] = [
  { id: "1", tipo: "Material de Consumo", subtipo: "Material de Limpeza", descricao: "Produtos de limpeza para manutenção predial" },
  { id: "2", tipo: "Serviço", subtipo: "Manutenção Predial", descricao: "Serviço de manutenção corretiva e preventiva" },
  { id: "3", tipo: "Equipamento", subtipo: "Informática", descricao: "Computadores, monitores e periféricos" },
  { id: "4", tipo: "Material de Consumo", subtipo: "Material de Escritório", descricao: "Papel, canetas, grampeadores e afins" },
  { id: "5", tipo: "Serviço", subtipo: "Consultoria", descricao: "Consultoria em gestão administrativa" },
];

export const contratosMock: ContratoRef[] = [
  { id: "1", numero: "CT-2024-000001" },
  { id: "2", numero: "CT-2024-000002" },
  { id: "3", numero: "CT-2024-000003" },
];

export const initialLotes: Lote[] = [
  {
    id: "1",
    contratoId: "1",
    itens: [
      { id: "1-1", produtoServicoId: "1", quantidade: 200, valorUnitario: 45.50 },
      { id: "1-2", produtoServicoId: "4", quantidade: 500, valorUnitario: 12.75 },
      { id: "1-3", produtoServicoId: "3", quantidade: 10, valorUnitario: 4500.00 },
    ],
    previsaoEntrega: "2024-06-30",
    entregue: true,
    dataEntrega: "2024-06-28",
  },
  {
    id: "2",
    contratoId: "1",
    itens: [
      { id: "2-1", produtoServicoId: "3", quantidade: 25, valorUnitario: 5200.00 },
      { id: "2-2", produtoServicoId: "5", quantidade: 3, valorUnitario: 18000.00 },
    ],
    previsaoEntrega: "2024-08-15",
    entregue: false,
    dataEntrega: "",
  },
  {
    id: "3",
    contratoId: "2",
    itens: [
      { id: "3-1", produtoServicoId: "2", quantidade: 12, valorUnitario: 8500.00 },
      { id: "3-2", produtoServicoId: "1", quantidade: 300, valorUnitario: 32.00 },
    ],
    previsaoEntrega: "2024-09-01",
    entregue: false,
    dataEntrega: "",
  },
  {
    id: "4",
    contratoId: "3",
    itens: [
      { id: "4-1", produtoServicoId: "5", quantidade: 1, valorUnitario: 75000.00 },
    ],
    previsaoEntrega: "2024-10-15",
    entregue: false,
    dataEntrega: "",
  },
];

export const calcularValorItem = (item: LoteItem) => item.quantidade * item.valorUnitario;
export const calcularValorTotal = (itens: LoteItem[]) => itens.reduce((sum, i) => sum + calcularValorItem(i), 0);

const emptyItem: Omit<LoteItem, "id"> = {
  produtoServicoId: "",
  quantidade: 0,
  valorUnitario: 0,
};

interface LoteForm {
  contratoId: string;
  itens: LoteItem[];
  previsaoEntrega: string;
  entregue: boolean;
  dataEntrega: string;
}

const emptyForm: LoteForm = {
  contratoId: "",
  itens: [{ id: crypto.randomUUID(), produtoServicoId: "", quantidade: 0, valorUnitario: 0 }],
  previsaoEntrega: "",
  entregue: false,
  dataEntrega: "",
};

const Lotes = () => {
  const [lotes, setLotes] = useState<Lote[]>(initialLotes);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<LoteForm>(emptyForm);
  const [viewingLote, setViewingLote] = useState<Lote | null>(null);
  const { toast } = useToast();

  const getProdutoServico = (id: string) => produtosServicos.find((ps) => ps.id === id);

  const getContratoNumero = (id: string) => {
    const c = contratosMock.find((ct) => ct.id === id);
    return c ? c.numero : "—";
  };

  const filtered = lotes.filter((lote) => {
    const textos = lote.itens.map((item) => {
      const ps = getProdutoServico(item.produtoServicoId);
      return ps ? `${ps.tipo} ${ps.subtipo} ${ps.descricao}` : "";
    }).join(" ");
    return textos.toLowerCase().includes(search.toLowerCase()) ||
      calcularValorTotal(lote.itens).toString().includes(search);
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, itens: [{ id: crypto.randomUUID(), produtoServicoId: "", quantidade: 0, valorUnitario: 0 }] });
    setDialogOpen(true);
  };

  const openEdit = (lote: Lote) => {
    setEditingId(lote.id);
    setForm({
      contratoId: lote.contratoId,
      itens: lote.itens.map((i) => ({ ...i })),
      previsaoEntrega: lote.previsaoEntrega,
      entregue: lote.entregue,
      dataEntrega: lote.dataEntrega,
    });
    setDialogOpen(true);
  };

  const addItem = () => {
    setForm({
      ...form,
      itens: [...form.itens, { id: crypto.randomUUID(), produtoServicoId: "", quantidade: 0, valorUnitario: 0 }],
    });
  };

  const removeItem = (itemId: string) => {
    if (form.itens.length <= 1) return;
    setForm({ ...form, itens: form.itens.filter((i) => i.id !== itemId) });
  };

  const updateItem = (itemId: string, field: keyof Omit<LoteItem, "id">, value: string | number) => {
    setForm({
      ...form,
      itens: form.itens.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)),
    });
  };

  const handleSave = () => {
    if (!form.contratoId || !form.previsaoEntrega) {
      toast({ title: "Campos obrigatórios", description: "Selecione o Contrato e a Previsão de Entrega.", variant: "destructive" });
      return;
    }
    const hasInvalidItem = form.itens.some((i) => !i.produtoServicoId || i.quantidade <= 0 || i.valorUnitario <= 0);
    if (hasInvalidItem) {
      toast({ title: "Itens incompletos", description: "Preencha Produto/Serviço, quantidade e valor unitário de todos os itens.", variant: "destructive" });
      return;
    }
    if (form.entregue && !form.dataEntrega) {
      toast({ title: "Data de entrega obrigatória", description: "Informe a data da entrega quando o lote estiver marcado como entregue.", variant: "destructive" });
      return;
    }

    if (editingId) {
      setLotes((prev) => prev.map((l) => (l.id === editingId ? { ...l, ...form } : l)));
      toast({ title: "Lote atualizado com sucesso!" });
    } else {
      setLotes((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
      toast({ title: "Lote cadastrado com sucesso!" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setLotes((prev) => prev.filter((l) => l.id !== deletingId));
      toast({ title: "Lote excluído com sucesso!" });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(value);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return format(new Date(dateStr + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Layers className="h-7 w-7 text-primary" />
              Lotes
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie os lotes vinculados a contratos e seus produtos/serviços
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Lote
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por produto/serviço ou valor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Produtos/Serviços</TableHead>
                <TableHead>Qtd. Itens</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Prev. Entrega</TableHead>
                <TableHead>Entregue</TableHead>
                <TableHead>Data Entrega</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum lote encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((lote) => {
                  const resumoItens = lote.itens.map((item) => {
                    const ps = getProdutoServico(item.produtoServicoId);
                    return ps ? `${ps.subtipo}` : "—";
                  }).join(", ");
                  return (
                    <TableRow key={lote.id}>
                      <TableCell className="font-medium">{getContratoNumero(lote.contratoId)}</TableCell>
                      <TableCell className="max-w-[250px] truncate text-sm" title={resumoItens}>{resumoItens}</TableCell>
                      <TableCell>{lote.itens.length}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(calcularValorTotal(lote.itens))}</TableCell>
                      <TableCell>{formatDate(lote.previsaoEntrega)}</TableCell>
                      <TableCell>
                        {lote.entregue ? (
                          <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">Sim</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Não</span>
                        )}
                      </TableCell>
                      <TableCell>{lote.entregue ? formatDate(lote.dataEntrega) : "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setViewingLote(lote)} title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(lote)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setDeletingId(lote.id); setDeleteDialogOpen(true); }} title="Excluir" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Lote" : "Novo Lote"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Altere os dados do lote abaixo." : "Preencha os dados para cadastrar um novo lote."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contrato *</Label>
                  <Select value={form.contratoId} onValueChange={(value) => setForm({ ...form, contratoId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      {contratosMock.map((ct) => (
                        <SelectItem key={ct.id} value={ct.id}>{ct.numero}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previsaoEntrega">Previsão de Entrega *</Label>
                  <Input id="previsaoEntrega" type="date" value={form.previsaoEntrega} onChange={(e) => setForm({ ...form, previsaoEntrega: e.target.value })} />
                </div>
              </div>

              {/* Itens do Lote */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Itens do Lote</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Adicionar Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {form.itens.map((item, idx) => (
                    <div key={item.id} className="rounded-lg border bg-muted/20 p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Item {idx + 1}</span>
                        {form.itens.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Produto/Serviço *</Label>
                        <Select value={item.produtoServicoId} onValueChange={(value) => updateItem(item.id, "produtoServicoId", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {produtosServicos.map((ps) => (
                              <SelectItem key={ps.id} value={ps.id}>{ps.tipo} - {ps.subtipo}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Quantidade *</Label>
                          <Input type="number" step="0.0001" min="0" placeholder="0.0000" value={item.quantidade || ""} onChange={(e) => updateItem(item.id, "quantidade", parseFloat(parseFloat(e.target.value).toFixed(4)) || 0)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Valor Unitário (R$) *</Label>
                          <Input type="number" step="0.0001" min="0" placeholder="0.0000" value={item.valorUnitario || ""} onChange={(e) => updateItem(item.id, "valorUnitario", parseFloat(parseFloat(e.target.value).toFixed(4)) || 0)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Subtotal</Label>
                          <Input readOnly value={formatCurrency(calcularValorItem(item))} className="bg-muted/50 font-medium" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end rounded-lg border bg-primary/5 p-3">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Valor Total do Lote</span>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(calcularValorTotal(form.itens))}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Checkbox id="entregue" checked={form.entregue} onCheckedChange={(checked) => setForm({ ...form, entregue: !!checked, dataEntrega: checked ? form.dataEntrega : "" })} />
                <Label htmlFor="entregue" className="cursor-pointer">Entregue</Label>
              </div>

              {form.entregue && (
                <div className="space-y-2">
                  <Label htmlFor="dataEntrega">Data da Entrega *</Label>
                  <Input id="dataEntrega" type="date" value={form.dataEntrega} onChange={(e) => setForm({ ...form, dataEntrega: e.target.value })} />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editingId ? "Salvar Alterações" : "Cadastrar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <LoteDetailView
          lote={viewingLote}
          open={!!viewingLote}
          onOpenChange={(open) => { if (!open) setViewingLote(null); }}
        />
      </div>
    </DashboardLayout>
  );
};

export default Lotes;
