import { useState } from "react";
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
import { Plus, Pencil, Trash2, Search, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Emenda {
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

interface EmpenhoRef {
  id: string;
  numero: string;
}

const mockEmpenhos: EmpenhoRef[] = [
  { id: "1", numero: "2024NE000123" },
  { id: "2", numero: "2024NE000456" },
  { id: "3", numero: "2024NE000789" },
];

const initialEmendas: Emenda[] = [
  {
    id: "1",
    anoEmenda: "2024-01-01",
    tipo: "Individual",
    codigo: "EM00001",
    numeroEmenda: "202400000001",
    cargoAutor: "Deputado Federal",
    autor: "João Silva",
    objeto: "Aquisição de equipamentos hospitalares para o município",
    unidadeGestora: "Ministério da Saúde",
    valor: 500000.0,
    empenhoIds: ["1"],
  },
  {
    id: "2",
    anoEmenda: "2024-01-01",
    tipo: "Bancada",
    codigo: "EM00002",
    numeroEmenda: "202400000002",
    cargoAutor: "Senador",
    autor: "Maria Souza",
    objeto: "Construção de escola municipal no distrito rural",
    unidadeGestora: "Ministério da Educação",
    valor: 1200000.0,
    empenhoIds: ["2", "3"],
  },
];

const emptyForm: Omit<Emenda, "id"> = {
  anoEmenda: "",
  tipo: "",
  codigo: "",
  numeroEmenda: "",
  cargoAutor: "",
  autor: "",
  objeto: "",
  unidadeGestora: "",
  valor: 0,
  empenhoIds: [],
};

const EmendasParlamentares = () => {
  const [emendas, setEmendas] = useState<Emenda[]>(initialEmendas);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Emenda, "id">>(emptyForm);
  const { toast } = useToast();

  const filtered = emendas.filter(
    (e) =>
      e.numeroEmenda.toLowerCase().includes(search.toLowerCase()) ||
      e.autor.toLowerCase().includes(search.toLowerCase()) ||
      e.objeto.toLowerCase().includes(search.toLowerCase()) ||
      e.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (emenda: Emenda) => {
    setEditingId(emenda.id);
    setForm({
      anoEmenda: emenda.anoEmenda,
      tipo: emenda.tipo,
      codigo: emenda.codigo,
      numeroEmenda: emenda.numeroEmenda,
      cargoAutor: emenda.cargoAutor,
      autor: emenda.autor,
      objeto: emenda.objeto,
      unidadeGestora: emenda.unidadeGestora,
      valor: emenda.valor,
      empenhoIds: [...emenda.empenhoIds],
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.numeroEmenda || !form.tipo || !form.codigo || !form.autor || !form.anoEmenda) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      setEmendas((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...form } : e))
      );
      toast({ title: "Emenda atualizada com sucesso!" });
    } else {
      const newEmenda: Emenda = {
        id: crypto.randomUUID(),
        ...form,
      };
      setEmendas((prev) => [...prev, newEmenda]);
      toast({ title: "Emenda cadastrada com sucesso!" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setEmendas((prev) => prev.filter((e) => e.id !== deletingId));
      toast({ title: "Emenda excluída com sucesso!" });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const toggleEmpenho = (empenhoId: string) => {
    setForm((prev) => ({
      ...prev,
      empenhoIds: prev.empenhoIds.includes(empenhoId)
        ? prev.empenhoIds.filter((id) => id !== empenhoId)
        : [...prev.empenhoIds, empenhoId],
    }));
  };

  const getEmpenhoNumeros = (ids: string[]) =>
    ids
      .map((id) => mockEmpenhos.find((e) => e.id === id)?.numero)
      .filter(Boolean)
      .join(", ");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return format(new Date(dateStr + "T00:00:00"), "yyyy", { locale: ptBR });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Landmark className="h-7 w-7 text-primary" />
              Emendas Parlamentares
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as emendas parlamentares e seus vínculos com empenhos
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Emenda
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, autor, objeto ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary text-primary-foreground [&>th]:text-primary-foreground">
                <TableHead>Ano</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Nº Emenda</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Objeto</TableHead>
                <TableHead>Unidade Gestora</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Empenhos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    Nenhuma emenda encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((emenda) => (
                  <TableRow key={emenda.id}>
                    <TableCell>{formatDate(emenda.anoEmenda)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                        {emenda.tipo}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{emenda.codigo}</TableCell>
                    <TableCell className="font-medium">{emenda.numeroEmenda}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{emenda.autor}</p>
                        <p className="text-xs text-muted-foreground">{emenda.cargoAutor}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[200px] truncate text-sm text-muted-foreground">{emenda.objeto}</p>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[150px] truncate text-sm">{emenda.unidadeGestora}</p>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(emenda.valor)}</TableCell>
                    <TableCell>
                      <p className="max-w-[150px] truncate text-xs text-muted-foreground">
                        {getEmpenhoNumeros(emenda.empenhoIds) || "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(emenda)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingId(emenda.id);
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

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Emenda" : "Nova Emenda Parlamentar"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Altere os dados da emenda abaixo."
                  : "Preencha os dados para cadastrar uma nova emenda parlamentar."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anoEmenda">Ano da Emenda *</Label>
                  <Input
                    id="anoEmenda"
                    type="date"
                    value={form.anoEmenda}
                    onChange={(e) => setForm({ ...form, anoEmenda: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Input
                    id="tipo"
                    placeholder="Ex: Individual"
                    maxLength={30}
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    placeholder="Ex: EM00001"
                    maxLength={8}
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroEmenda">Nº da Emenda *</Label>
                  <Input
                    id="numeroEmenda"
                    placeholder="Ex: 202400000001"
                    maxLength={12}
                    value={form.numeroEmenda}
                    onChange={(e) => setForm({ ...form, numeroEmenda: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.0000"
                    value={form.valor || ""}
                    onChange={(e) =>
                      setForm({ ...form, valor: parseFloat(parseFloat(e.target.value).toFixed(4)) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargoAutor">Cargo do Autor</Label>
                  <Input
                    id="cargoAutor"
                    placeholder="Ex: Deputado Federal"
                    maxLength={16}
                    value={form.cargoAutor}
                    onChange={(e) => setForm({ ...form, cargoAutor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="autor">Autor *</Label>
                  <Input
                    id="autor"
                    placeholder="Nome do autor da emenda"
                    maxLength={256}
                    value={form.autor}
                    onChange={(e) => setForm({ ...form, autor: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidadeGestora">Unidade Gestora</Label>
                <Input
                  id="unidadeGestora"
                  placeholder="Ex: Ministério da Saúde"
                  maxLength={256}
                  value={form.unidadeGestora}
                  onChange={(e) => setForm({ ...form, unidadeGestora: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objeto">Objeto</Label>
                <Textarea
                  id="objeto"
                  placeholder="Descrição do objeto da emenda parlamentar"
                  rows={3}
                  value={form.objeto}
                  onChange={(e) => setForm({ ...form, objeto: e.target.value })}
                />
              </div>

              {/* Empenhos N:N */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Empenhos Vinculados</Label>
                <div className="rounded-lg border bg-muted/30 p-3 space-y-2 max-h-[160px] overflow-y-auto">
                  {mockEmpenhos.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3">
                      <Checkbox
                        id={`empenho-${emp.id}`}
                        checked={form.empenhoIds.includes(emp.id)}
                        onCheckedChange={() => toggleEmpenho(emp.id)}
                      />
                      <Label htmlFor={`empenho-${emp.id}`} className="cursor-pointer text-sm">
                        {emp.numero}
                      </Label>
                    </div>
                  ))}
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta emenda? Esta ação não pode ser desfeita.
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

export default EmendasParlamentares;
