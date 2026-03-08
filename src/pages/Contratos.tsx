import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Pencil, Trash2, ScrollText, Eye, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ContratoDetailView from "@/components/ContratoDetailView";

interface Processo {
  id: string;
  nup: string;
  sigla: string;
}

export interface Contrato {
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
  dataRescisao: string;
  motivoRescisao: string;
}

// Mock processos for FK reference
const processosMock: Processo[] = [
  { id: "1", nup: "12345678901", sigla: "PC-2024/001" },
  { id: "2", nup: "98765432100", sigla: "PC-2024/002" },
];

// Mock contratos iniciais
const initialContratos: Contrato[] = [
  {
    id: "1",
    numero: "CT-2024-000001",
    contratado: "Tech Solutions Ltda",
    objeto: "Manutenção de sistemas de informação",
    processoId: "1",
    nupContrato: "11122233344",
    valorTotal: 450000.0,
    dataContrato: "2024-01-20",
    vigenciaInicio: "2024-02-01",
    vigenciaFim: "2026-03-25",
    dataPublicacao: "2024-01-25",
    rescindido: false,
    dataRescisao: "",
    motivoRescisao: "",
  },
  {
    id: "2",
    numero: "CT-2024-000002",
    contratado: "Serviços Alfa S.A.",
    objeto: "Prestação de serviços de limpeza",
    processoId: "2",
    nupContrato: "22233344455",
    valorTotal: 320000.0,
    dataContrato: "2024-03-10",
    vigenciaInicio: "2024-04-01",
    vigenciaFim: "2026-03-15",
    dataPublicacao: "2024-03-15",
    rescindido: false,
    dataRescisao: "",
    motivoRescisao: "",
  },
  {
    id: "3",
    numero: "CT-2024-000003",
    contratado: "Construtora Beta Ltda",
    objeto: "Reforma predial - Bloco B",
    processoId: "1",
    nupContrato: "33344455566",
    valorTotal: 890000.0,
    dataContrato: "2024-05-01",
    vigenciaInicio: "2024-06-01",
    vigenciaFim: "2026-12-31",
    dataPublicacao: "2024-05-10",
    rescindido: false,
    dataRescisao: "",
    motivoRescisao: "",
  },
  {
    id: "4",
    numero: "CT-2024-000004",
    contratado: "Logística Express Ltda",
    objeto: "Serviço de transporte e logística",
    processoId: "2",
    nupContrato: "44455566677",
    valorTotal: 175000.0,
    dataContrato: "2024-07-15",
    vigenciaInicio: "2024-08-01",
    vigenciaFim: "2026-04-02",
    dataPublicacao: "2024-07-20",
    rescindido: false,
    dataRescisao: "",
    motivoRescisao: "",
  },
];

const emptyForm: Omit<Contrato, "id"> = {
  numero: "",
  contratado: "",
  objeto: "",
  processoId: "",
  nupContrato: "",
  valorTotal: 0,
  dataContrato: "",
  vigenciaInicio: "",
  vigenciaFim: "",
  dataPublicacao: "",
  rescindido: false,
  dataRescisao: "",
  motivoRescisao: "",
};

const Contratos = () => {
  const [contratos, setContratos] = useState<Contrato[]>(initialContratos);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Contrato, "id">>(emptyForm);
  const [viewingContrato, setViewingContrato] = useState<Contrato | null>(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { toast } = useToast();

  const contratosVencendo = contratos.filter((c) => {
    if (c.rescindido || !c.vigenciaFim) return false;
    const hoje = new Date();
    const fim = new Date(c.vigenciaFim + "T00:00:00");
    const dias = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return dias >= 0 && dias <= 30;
  });

  const getDiasRestantes = (vigenciaFim: string) => {
    const hoje = new Date();
    const fim = new Date(vigenciaFim + "T00:00:00");
    return Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getProcessoLabel = (id: string) => {
    const p = processosMock.find((pr) => pr.id === id);
    return p ? `${p.nup} - ${p.sigla}` : "—";
  };

  const filtered = contratos.filter(
    (c) =>
      c.numero.toLowerCase().includes(search.toLowerCase()) ||
      c.contratado.toLowerCase().includes(search.toLowerCase()) ||
      c.nupContrato.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (contrato: Contrato) => {
    const { id, ...rest } = contrato;
    setForm(rest);
    setEditingId(id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.numero || !form.contratado || !form.dataContrato) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    if (form.rescindido && !form.dataRescisao) {
      toast({ title: "Informe a data de rescisão", variant: "destructive" });
      return;
    }
    if (editingId) {
      setContratos((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)));
      toast({ title: "Contrato atualizado com sucesso" });
    } else {
      setContratos((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
      toast({ title: "Contrato criado com sucesso" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setContratos((prev) => prev.filter((c) => c.id !== deletingId));
      toast({ title: "Contrato excluído com sucesso" });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(value);

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 space-y-6">
          {/* Alert Banner */}
          {contratosVencendo.length > 0 && !bannerDismissed && (
            <div className="relative flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 animate-fade-in">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {contratosVencendo.length} {contratosVencendo.length === 1 ? "contrato vence" : "contratos vencem"} nos próximos 30 dias
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/70">
                  Verifique os contratos e tome as providências necessárias para renovação ou encerramento.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-amber-500/40 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400"
                onClick={() => setAlertModalOpen(true)}
              >
                Ver contratos
              </Button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="absolute top-2 right-2 p-0.5 rounded-md text-amber-600/60 hover:text-amber-700 hover:bg-amber-500/10 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ScrollText className="h-7 w-7 text-primary" />
                Contratos
              </h1>
              <p className="text-sm text-muted-foreground">Gerencie os contratos públicos</p>
            </div>
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Contrato
            </Button>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, contratado, NUP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Contratado</TableHead>
                  <TableHead>NUP Processo</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Rescindido</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhum contrato encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.numero}</TableCell>
                      <TableCell>{c.contratado}</TableCell>
                      <TableCell>{getProcessoLabel(c.processoId)}</TableCell>
                      <TableCell>{formatCurrency(c.valorTotal)}</TableCell>
                      <TableCell className="text-xs">
                        {formatDate(c.vigenciaInicio)} — {formatDate(c.vigenciaFim)}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${c.rescindido ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground"}`}>
                          {c.rescindido ? "Sim" : "Não"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setViewingContrato(c)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setDeletingId(c.id); setDeleteDialogOpen(true); }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
              <DialogDescription>Preencha os dados do contrato</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número *</Label>
                  <Input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value.slice(0, 15) })} maxLength={15} placeholder="CT-0000-000000" />
                </div>
                <div className="space-y-2">
                  <Label>Contratado *</Label>
                  <Input value={form.contratado} onChange={(e) => setForm({ ...form, contratado: e.target.value.slice(0, 256) })} maxLength={256} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Objeto</Label>
                <Textarea value={form.objeto} onChange={(e) => setForm({ ...form, objeto: e.target.value })} rows={3} placeholder="Descrição do objeto contratual" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NUP Processo (FK)</Label>
                  <Select value={form.processoId} onValueChange={(v) => setForm({ ...form, processoId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o processo" />
                    </SelectTrigger>
                    <SelectContent>
                      {processosMock.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nup} - {p.sigla}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>NUP Contrato</Label>
                  <Input value={form.nupContrato} onChange={(e) => setForm({ ...form, nupContrato: e.target.value.slice(0, 11) })} maxLength={11} placeholder="00000000000" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor Total (R$)</Label>
                  <Input type="number" step="0.0001" min="0" value={form.valorTotal || ""} onChange={(e) => setForm({ ...form, valorTotal: parseFloat(parseFloat(e.target.value).toFixed(4)) || 0 })} placeholder="0.0000" />
                </div>
                <div className="space-y-2">
                  <Label>Data do Contrato *</Label>
                  <Input type="date" value={form.dataContrato} onChange={(e) => setForm({ ...form, dataContrato: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Vigência Início</Label>
                  <Input type="date" value={form.vigenciaInicio} onChange={(e) => setForm({ ...form, vigenciaInicio: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Vigência Fim</Label>
                  <Input type="date" value={form.vigenciaFim} onChange={(e) => setForm({ ...form, vigenciaFim: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Data Publicação</Label>
                  <Input type="date" value={form.dataPublicacao} onChange={(e) => setForm({ ...form, dataPublicacao: e.target.value })} />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Checkbox
                  id="rescindido"
                  checked={form.rescindido}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, rescindido: !!checked, dataRescisao: !checked ? "" : form.dataRescisao, motivoRescisao: !checked ? "" : form.motivoRescisao })
                  }
                />
                <Label htmlFor="rescindido" className="cursor-pointer">Rescindido</Label>
              </div>

              {form.rescindido && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data da Rescisão *</Label>
                      <Input type="date" value={form.dataRescisao} onChange={(e) => setForm({ ...form, dataRescisao: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Motivo da Rescisão</Label>
                    <Textarea value={form.motivoRescisao} onChange={(e) => setForm({ ...form, motivoRescisao: e.target.value })} rows={3} placeholder="Descreva o motivo da rescisão" />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editingId ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ContratoDetailView
          contrato={viewingContrato}
          open={!!viewingContrato}
          onOpenChange={(open) => !open && setViewingContrato(null)}
        />
      </main>
    </div>
  );
};

export default Contratos;
