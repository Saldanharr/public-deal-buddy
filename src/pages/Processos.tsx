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
import { Label } from "@/components/ui/label";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Processo {
  id: string;
  nup: string;
  dataCriacao: string;
  departamentoGestor: string;
  prioritario: boolean;
  prioridade: string;
  sigla: string;
  assunto: string;
  interessado: string;
}

const emptyProcesso: Omit<Processo, "id"> = {
  nup: "",
  dataCriacao: "",
  departamentoGestor: "",
  prioritario: false,
  prioridade: "",
  sigla: "",
  assunto: "",
  interessado: "",
};

const Processos = () => {
  const [processos, setProcessos] = useState<Processo[]>([
    {
      id: "1",
      nup: "12345678901",
      dataCriacao: "2024-01-15",
      departamentoGestor: "Departamento de Compras",
      prioritario: true,
      prioridade: "Alta",
      sigla: "PC-2024/001",
      assunto: "Aquisição de equipamentos de informática para o setor administrativo",
      interessado: "Secretaria de Administração",
    },
  ]);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Processo, "id">>(emptyProcesso);
  const { toast } = useToast();

  const filtered = processos.filter(
    (p) =>
      p.nup.toLowerCase().includes(search.toLowerCase()) ||
      p.sigla.toLowerCase().includes(search.toLowerCase()) ||
      p.departamentoGestor.toLowerCase().includes(search.toLowerCase()) ||
      p.interessado.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm(emptyProcesso);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (processo: Processo) => {
    setForm({
      nup: processo.nup,
      dataCriacao: processo.dataCriacao,
      departamentoGestor: processo.departamentoGestor,
      prioritario: processo.prioritario,
      prioridade: processo.prioridade,
      sigla: processo.sigla,
      assunto: processo.assunto,
      interessado: processo.interessado,
    });
    setEditingId(processo.id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nup || !form.dataCriacao || !form.departamentoGestor) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    if (editingId) {
      setProcessos((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
      toast({ title: "Processo atualizado com sucesso" });
    } else {
      setProcessos((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...form },
      ]);
      toast({ title: "Processo criado com sucesso" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setProcessos((prev) => prev.filter((p) => p.id !== deletingId));
      toast({ title: "Processo excluído com sucesso" });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Processos</h1>
              <p className="text-sm text-muted-foreground">Gerencie os processos administrativos</p>
            </div>
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Processo
            </Button>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por NUP, sigla, departamento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NUP</TableHead>
                  <TableHead>Sigla</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead>Depto. Gestor</TableHead>
                  <TableHead>Prioritário</TableHead>
                  <TableHead>Interessado</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhum processo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nup}</TableCell>
                      <TableCell>{p.sigla}</TableCell>
                      <TableCell>{new Date(p.dataCriacao + "T00:00:00").toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{p.departamentoGestor}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${p.prioritario ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                          {p.prioritario ? p.prioridade || "Sim" : "Não"}
                        </span>
                      </TableCell>
                      <TableCell>{p.interessado}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setDeletingId(p.id); setDeleteDialogOpen(true); }}>
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
              <DialogTitle>{editingId ? "Editar Processo" : "Novo Processo"}</DialogTitle>
              <DialogDescription>Preencha os dados do processo</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NUP *</Label>
                  <Input value={form.nup} onChange={(e) => setForm({ ...form, nup: e.target.value.slice(0, 11) })} placeholder="00000000000" maxLength={11} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Criação *</Label>
                  <Input type="date" value={form.dataCriacao} onChange={(e) => setForm({ ...form, dataCriacao: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Departamento Gestor *</Label>
                  <Input value={form.departamentoGestor} onChange={(e) => setForm({ ...form, departamentoGestor: e.target.value.slice(0, 120) })} maxLength={120} />
                </div>
                <div className="space-y-2">
                  <Label>Sigla do Processo</Label>
                  <Input value={form.sigla} onChange={(e) => setForm({ ...form, sigla: e.target.value.slice(0, 256) })} maxLength={256} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Interessado</Label>
                  <Input value={form.interessado} onChange={(e) => setForm({ ...form, interessado: e.target.value.slice(0, 256) })} maxLength={256} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pt-6">
                    <Checkbox checked={form.prioritario} onCheckedChange={(checked) => setForm({ ...form, prioritario: !!checked, prioridade: !checked ? "" : form.prioridade })} />
                    <Label>Prioritário</Label>
                  </div>
                </div>
              </div>
              {form.prioritario && (
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Input value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value.slice(0, 50) })} placeholder="Ex: Alta, Média, Baixa" maxLength={50} />
                </div>
              )}
              <div className="space-y-2">
                <Label>Assunto</Label>
                <Textarea value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} placeholder="Descreva o assunto do processo" rows={3} />
              </div>
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
              <DialogDescription>Tem certeza que deseja excluir este processo? Esta ação não pode ser desfeita.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Processos;
