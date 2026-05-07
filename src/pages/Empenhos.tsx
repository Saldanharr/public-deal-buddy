import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Search, Receipt, Eye, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import EmpenhoDetailView from "@/components/EmpenhoDetailView";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Empenho {
  id: string;
  numero: string;
  valor: number;
  elementoDespesa: string;
  dataEmpenho: string;
  assunto: string;
  emendaParlamentar: boolean;
  autorEmenda: string;
}

const initialEmpenhos: Empenho[] = [
  {
    id: "1",
    numero: "2024NE000123",
    valor: 150000.00,
    elementoDespesa: "339039",
    dataEmpenho: "2024-03-15",
    assunto: "Aquisição de material de consumo para manutenção predial",
    emendaParlamentar: false,
    autorEmenda: "",
  },
  {
    id: "2",
    numero: "2024NE000456",
    valor: 87500.50,
    elementoDespesa: "449052",
    dataEmpenho: "2024-04-20",
    assunto: "Aquisição de equipamentos de informática",
    emendaParlamentar: true,
    autorEmenda: "Dep. João Silva",
  },
  {
    id: "3",
    numero: "2024NE000789",
    valor: 320000.00,
    elementoDespesa: "339037",
    dataEmpenho: "2024-05-10",
    assunto: "Contratação de serviço de limpeza e conservação",
    emendaParlamentar: false,
    autorEmenda: "",
  },
];

const emptyForm: Omit<Empenho, "id"> = {
  numero: "",
  valor: 0,
  elementoDespesa: "",
  dataEmpenho: "",
  assunto: "",
  emendaParlamentar: false,
  autorEmenda: "",
};

const Empenhos = () => {
  const [empenhos, setEmpenhos] = useState<Empenho[]>(initialEmpenhos);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Empenho, "id">>(emptyForm);
  const [viewingEmpenho, setViewingEmpenho] = useState<Empenho | null>(null);
  const [saldoLimite, setSaldoLimite] = useState<number>(50000);
  const { toast } = useToast();

  // Mock execução estável por empenho (substituir por dados reais)
  const execucaoMap = useMemo(() => {
    const map: Record<string, number> = {};
    empenhos.forEach((e) => {
      const seed = parseInt(e.id.replace(/\D/g, "") || "1", 10) || e.numero.length;
      map[e.id] = (seed * 37) % 101;
    });
    return map;
  }, [empenhos]);

  const filtered = empenhos.filter(
    (e) =>
      e.numero.toLowerCase().includes(search.toLowerCase()) ||
      e.assunto.toLowerCase().includes(search.toLowerCase()) ||
      e.elementoDespesa.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (empenho: Empenho) => {
    setEditingId(empenho.id);
    setForm({
      numero: empenho.numero,
      valor: empenho.valor,
      elementoDespesa: empenho.elementoDespesa,
      dataEmpenho: empenho.dataEmpenho,
      assunto: empenho.assunto,
      emendaParlamentar: empenho.emendaParlamentar,
      autorEmenda: empenho.autorEmenda,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.numero || !form.dataEmpenho || !form.elementoDespesa) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      setEmpenhos((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...form } : e))
      );
      toast({ title: "Empenho atualizado com sucesso!" });
    } else {
      const newEmpenho: Empenho = {
        id: crypto.randomUUID(),
        ...form,
      };
      setEmpenhos((prev) => [...prev, newEmpenho]);
      toast({ title: "Empenho cadastrado com sucesso!" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setEmpenhos((prev) => prev.filter((e) => e.id !== deletingId));
      toast({ title: "Empenho excluído com sucesso!" });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return format(new Date(dateStr + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Receipt className="h-7 w-7 text-primary" />
              Empenhos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as notas de empenho do órgão
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Empenho
          </Button>
        </div>

        {/* Search + Limite */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, assunto ou elemento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="saldoLimite" className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              Alertar saldo a liquidar &gt;
            </Label>
            <Input
              id="saldoLimite"
              type="number"
              min="0"
              step="1000"
              value={saldoLimite}
              onChange={(e) => setSaldoLimite(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-32 h-9"
            />
            <span className="text-xs text-muted-foreground">R$</span>
          </div>
        </div>

        {(() => {
          const alertCount = filtered.filter((e) => {
            const exec = execucaoMap[e.id] ?? 0;
            return e.valor * (1 - exec / 100) > saldoLimite;
          }).length;
          return alertCount > 0 ? (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>
                <strong>{alertCount}</strong> empenho(s) com saldo a liquidar acima de {formatCurrency(saldoLimite)}.
              </span>
            </div>
          ) : null;
        })()}

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary text-primary-foreground [&>th]:text-primary-foreground">
                <TableHead>Emenda</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Elem. Despesa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Execução</TableHead>
                <TableHead>Nº Empenho</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Nenhum empenho encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((empenho) => {
                  const execucao = execucaoMap[empenho.id] ?? 0;
                  const temSaldo = execucao < 100;
                  const saldoLiquidar = empenho.valor * (1 - execucao / 100);
                  const acimaLimite = saldoLiquidar > saldoLimite;
                  return (
                    <TableRow key={empenho.id} className={acimaLimite ? "bg-destructive/5 hover:bg-destructive/10" : undefined}>
                      <TableCell>
                        {empenho.emendaParlamentar ? (
                          <span className="inline-flex items-center rounded-full bg-destructive/10 text-destructive px-2.5 py-0.5 text-xs font-semibold">
                            Sim
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            Não
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[280px]">
                          <p className="font-semibold text-foreground truncate">{empenho.numero}</p>
                          <p className="text-sm text-muted-foreground truncate">{empenho.assunto}</p>
                          {empenho.emendaParlamentar && empenho.autorEmenda && (
                            <p className="text-xs text-muted-foreground/70 truncate">Autor: {empenho.autorEmenda}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(empenho.valor)}</TableCell>
                      <TableCell>{empenho.elementoDespesa}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          temSaldo
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {temSaldo ? "Com Saldo" : "Sem Saldo"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 min-w-[100px] cursor-help">
                              <Progress value={execucao} className="h-2 w-16" />
                              <span className="text-xs font-medium text-muted-foreground">{execucao}%</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1 text-xs">
                              <p className="font-semibold">
                                {execucao === 0
                                  ? "Pendente"
                                  : execucao >= 100
                                  ? "Execução integral"
                                  : "Execução parcial"}
                              </p>
                              <p className="opacity-90">
                                {execucao === 0
                                  ? "Nenhuma liquidação registrada para este empenho."
                                  : execucao >= 100
                                  ? "Valor liquidado equivale ao total empenhado."
                                  : `${execucao}% do valor empenhado já foi liquidado. Saldo a liquidar: ${formatCurrency(empenho.valor * (1 - execucao / 100))}.`}
                              </p>
                              <div className="pt-1 border-t border-border/40 space-y-0.5">
                                <p>Empenhado: <span className="font-medium">{formatCurrency(empenho.valor)}</span></p>
                                <p>Liquidado: <span className="font-medium">{formatCurrency(empenho.valor * execucao / 100)}</span></p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="font-medium">{empenho.numero}</TableCell>
                      <TableCell>{formatDate(empenho.dataEmpenho)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setViewingEmpenho(empenho)} title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(empenho)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingId(empenho.id);
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Empenho" : "Novo Empenho"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Altere os dados do empenho abaixo."
                  : "Preencha os dados para cadastrar um novo empenho."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Nº do Empenho *</Label>
                  <Input
                    id="numero"
                    placeholder="Ex: 2024NE000123"
                    value={form.numero}
                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.valor || ""}
                    onChange={(e) =>
                      setForm({ ...form, valor: parseFloat(parseFloat(e.target.value).toFixed(2)) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="elementoDespesa">Elemento de Despesa *</Label>
                  <Input
                    id="elementoDespesa"
                    placeholder="Ex: 339039"
                    value={form.elementoDespesa}
                    onChange={(e) => setForm({ ...form, elementoDespesa: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataEmpenho">Data do Empenho *</Label>
                  <Input
                    id="dataEmpenho"
                    type="date"
                    value={form.dataEmpenho}
                    onChange={(e) => setForm({ ...form, dataEmpenho: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Textarea
                  id="assunto"
                  placeholder="Descrição do documento da nota de empenho"
                  rows={3}
                  value={form.assunto}
                  onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Checkbox
                  id="emendaParlamentar"
                  checked={form.emendaParlamentar}
                  onCheckedChange={(checked) =>
                    setForm({
                      ...form,
                      emendaParlamentar: !!checked,
                      autorEmenda: checked ? form.autorEmenda : "",
                    })
                  }
                />
                <Label htmlFor="emendaParlamentar" className="cursor-pointer">
                  Emenda Parlamentar
                </Label>
              </div>

              {form.emendaParlamentar && (
                <div className="space-y-2">
                  <Label htmlFor="autorEmenda">Autor da Emenda</Label>
                  <Input
                    id="autorEmenda"
                    placeholder="Nome do autor da emenda parlamentar"
                    value={form.autorEmenda}
                    onChange={(e) => setForm({ ...form, autorEmenda: e.target.value })}
                  />
                </div>
              )}
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este empenho? Esta ação não pode ser desfeita.
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

        <EmpenhoDetailView
          empenho={viewingEmpenho}
          open={!!viewingEmpenho}
          onOpenChange={(open) => !open && setViewingEmpenho(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Empenhos;
