import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Pencil, Trash2, Search, DollarSign, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LiquidacaoDetailView from "@/components/LiquidacaoDetailView";

// --- Mock references ---
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

const empenhosMock: EmpenhoRef[] = [
  { id: "1", numero: "2024NE000123", valor: 150000.0 },
  { id: "2", numero: "2024NE000456", valor: 87500.5 },
  { id: "3", numero: "2024NE000789", valor: 320000.0 },
];

const lotesMock: LoteRef[] = [
  { id: "1", descricao: "Material de Consumo - Material de Limpeza", contratoNumero: "CT-2024-000001" },
  { id: "2", descricao: "Equipamento - Informática", contratoNumero: "CT-2024-000001" },
  { id: "3", descricao: "Serviço - Manutenção Predial", contratoNumero: "CT-2024-000002" },
];

// --- Types ---
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

const initialLiquidacoes: Liquidacao[] = [
  {
    id: "1",
    numero: "LIQ-2024-001",
    empenhoIds: ["1", "2"],
    lotesQuantidades: [
      { loteId: "1", quantidade: 10.0 },
      { loteId: "2", quantidade: 5.5 },
    ],
    descricao: "Liquidação referente à entrega parcial de materiais e equipamentos",
    valorTotal: 55000.0,
    dataLiquidacao: "2024-07-15",
  },
];

interface LiquidacaoForm {
  numero: string;
  empenhoIds: string[];
  lotesQuantidades: LoteQuantidade[];
  descricao: string;
  valorTotal: number;
  dataLiquidacao: string;
}

const emptyForm: LiquidacaoForm = {
  numero: "",
  empenhoIds: [],
  lotesQuantidades: [],
  descricao: "",
  valorTotal: 0,
  dataLiquidacao: "",
};

const Liquidacoes = () => {
  const [liquidacoes, setLiquidacoes] = useState<Liquidacao[]>(initialLiquidacoes);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedLiquidacao, setSelectedLiquidacao] = useState<Liquidacao | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [form, setForm] = useState<LiquidacaoForm>(emptyForm);
  const { toast } = useToast();

  const filtered = liquidacoes.filter(
    (l) =>
      l.numero.toLowerCase().includes(search.toLowerCase()) ||
      l.descricao.toLowerCase().includes(search.toLowerCase())
  );

  const getEmpenhoNumero = (id: string) =>
    empenhosMock.find((e) => e.id === id)?.numero ?? "—";

  const getLoteDescricao = (id: string) =>
    lotesMock.find((l) => l.id === id)?.descricao ?? "—";

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (liq: Liquidacao) => {
    setEditingId(liq.id);
    setForm({
      numero: liq.numero,
      empenhoIds: [...liq.empenhoIds],
      lotesQuantidades: liq.lotesQuantidades.map((lq) => ({ ...lq })),
      descricao: liq.descricao,
      valorTotal: liq.valorTotal,
      dataLiquidacao: liq.dataLiquidacao,
    });
    setDialogOpen(true);
  };

  const toggleEmpenho = (empenhoId: string) => {
    setForm((prev) => ({
      ...prev,
      empenhoIds: prev.empenhoIds.includes(empenhoId)
        ? prev.empenhoIds.filter((id) => id !== empenhoId)
        : [...prev.empenhoIds, empenhoId],
    }));
  };

  const toggleLote = (loteId: string) => {
    setForm((prev) => {
      const exists = prev.lotesQuantidades.find((lq) => lq.loteId === loteId);
      return {
        ...prev,
        lotesQuantidades: exists
          ? prev.lotesQuantidades.filter((lq) => lq.loteId !== loteId)
          : [...prev.lotesQuantidades, { loteId, quantidade: 0 }],
      };
    });
  };

  const updateLoteQuantidade = (loteId: string, quantidade: number) => {
    setForm((prev) => ({
      ...prev,
      lotesQuantidades: prev.lotesQuantidades.map((lq) =>
        lq.loteId === loteId ? { ...lq, quantidade } : lq
      ),
    }));
  };

  const handleSave = () => {
    if (!form.numero || !form.dataLiquidacao || form.empenhoIds.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o número, data e selecione ao menos um empenho.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      setLiquidacoes((prev) =>
        prev.map((l) => (l.id === editingId ? { ...l, ...form } : l))
      );
      toast({ title: "Liquidação atualizada com sucesso!" });
    } else {
      setLiquidacoes((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...form },
      ]);
      toast({ title: "Liquidação cadastrada com sucesso!" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setLiquidacoes((prev) => prev.filter((l) => l.id !== deletingId));
      toast({ title: "Liquidação excluída com sucesso!" });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return format(new Date(dateStr + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <DollarSign className="h-7 w-7 text-primary" />
              Liquidações
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as liquidações vinculadas a empenhos e lotes
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Liquidação
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Liquidação</TableHead>
                <TableHead>Empenhos</TableHead>
                <TableHead>Lotes</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="hidden lg:table-cell">Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma liquidação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((liq) => (
                  <TableRow key={liq.id}>
                    <TableCell className="font-medium">{liq.numero}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {liq.empenhoIds.map((eid) => (
                          <span
                            key={eid}
                            className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                          >
                            {getEmpenhoNumero(eid)}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {liq.lotesQuantidades.map((lq) => (
                          <span
                            key={lq.loteId}
                            className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                            title={`Qtd: ${lq.quantidade.toFixed(2)}`}
                          >
                            {getLoteDescricao(lq.loteId).substring(0, 20)}… ({lq.quantidade.toFixed(2)})
                          </span>
                        ))}
                        {liq.lotesQuantidades.length === 0 && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(liq.valorTotal)}</TableCell>
                    <TableCell>{formatDate(liq.dataLiquidacao)}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                      {liq.descricao}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedLiquidacao(liq);
                            setDetailOpen(true);
                          }}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(liq)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingId(liq.id);
                            setDeleteDialogOpen(true);
                          }}
                          title="Excluir"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <LiquidacaoDetailView
          liquidacao={selectedLiquidacao}
          empenhos={empenhosMock}
          lotes={lotesMock}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Liquidação" : "Nova Liquidação"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Altere os dados da liquidação abaixo."
                  : "Preencha os dados para cadastrar uma nova liquidação."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Nº da Liquidação *</Label>
                  <Input
                    id="numero"
                    placeholder="Ex: LIQ-2024-001"
                    maxLength={11}
                    value={form.numero}
                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataLiquidacao">Data da Liquidação *</Label>
                  <Input
                    id="dataLiquidacao"
                    type="date"
                    value={form.dataLiquidacao}
                    onChange={(e) => setForm({ ...form, dataLiquidacao: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorTotal">Valor Total (R$) *</Label>
                  <Input
                    id="valorTotal"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.0000"
                    value={form.valorTotal || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        valorTotal: parseFloat(parseFloat(e.target.value).toFixed(4)) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição da liquidação"
                  rows={3}
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
              </div>

              {/* Empenhos multi-select */}
              <div className="space-y-2">
                <Label>Empenhos vinculados *</Label>
                <div className="rounded-md border bg-background p-3 space-y-2 max-h-[160px] overflow-y-auto">
                  {empenhosMock.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3">
                      <Checkbox
                        id={`emp-${emp.id}`}
                        checked={form.empenhoIds.includes(emp.id)}
                        onCheckedChange={() => toggleEmpenho(emp.id)}
                      />
                      <Label htmlFor={`emp-${emp.id}`} className="cursor-pointer text-sm font-normal">
                        {emp.numero} — {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(emp.valor)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lotes multi-select with quantity */}
              <div className="space-y-2">
                <Label>Lotes vinculados</Label>
                <div className="rounded-md border bg-background p-3 space-y-3 max-h-[220px] overflow-y-auto">
                  {lotesMock.map((lote) => {
                    const selected = form.lotesQuantidades.find((lq) => lq.loteId === lote.id);
                    return (
                      <div key={lote.id} className="space-y-1">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`lote-${lote.id}`}
                            checked={!!selected}
                            onCheckedChange={() => toggleLote(lote.id)}
                          />
                          <Label htmlFor={`lote-${lote.id}`} className="cursor-pointer text-sm font-normal">
                            {lote.descricao} ({lote.contratoNumero})
                          </Label>
                        </div>
                        {selected && (
                          <div className="ml-8">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Quantidade"
                              className="h-8 w-40 text-sm"
                              value={selected.quantidade || ""}
                              onChange={(e) =>
                                updateLoteQuantidade(
                                  lote.id,
                                  parseFloat(parseFloat(e.target.value).toFixed(2)) || 0
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingId ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta liquidação? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Liquidacoes;
