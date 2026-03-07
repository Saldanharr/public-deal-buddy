import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Search, PackageSearch, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProdutoServicoDetailView, { getCategoryIcon } from "@/components/ProdutoServicoDetailView";

interface ProdutoServico {
  id: string;
  tipo: string;
  subtipo: string;
  descricao: string;
}

const initialData: ProdutoServico[] = [
  { id: "1", tipo: "Material de Consumo", subtipo: "Material de Limpeza", descricao: "Produtos de limpeza para manutenção predial, incluindo detergentes, desinfetantes e afins." },
  { id: "2", tipo: "Serviço", subtipo: "Manutenção Predial", descricao: "Serviço de manutenção corretiva e preventiva das instalações físicas do órgão." },
  { id: "3", tipo: "Equipamento", subtipo: "Informática", descricao: "Computadores, monitores e periféricos para uso administrativo." },
  { id: "4", tipo: "Serviço", subtipo: "TI - Sistemas", descricao: "Desenvolvimento e manutenção de sistemas de informação." },
  { id: "5", tipo: "Equipamento", subtipo: "Veículos", descricao: "Aquisição e locação de veículos para uso institucional." },
  { id: "6", tipo: "Material de Consumo", subtipo: "Combustível", descricao: "Abastecimento de combustível para frota institucional." },
  { id: "7", tipo: "Serviço", subtipo: "Segurança e Vigilância", descricao: "Prestação de serviços de vigilância patrimonial." },
  { id: "8", tipo: "Material de Consumo", subtipo: "Alimentação", descricao: "Gêneros alimentícios para copa e refeitório." },
];
const emptyForm: Omit<ProdutoServico, "id"> = {
  tipo: "",
  subtipo: "",
  descricao: "",
};

const ProdutosServicos = () => {
  const [items, setItems] = useState<ProdutoServico[]>(initialData);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingItem, setViewingItem] = useState<ProdutoServico | null>(null);
  const [form, setForm] = useState<Omit<ProdutoServico, "id">>(emptyForm);
  const { toast } = useToast();

  const filtered = items.filter(
    (item) =>
      item.tipo.toLowerCase().includes(search.toLowerCase()) ||
      item.subtipo.toLowerCase().includes(search.toLowerCase()) ||
      item.descricao.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: ProdutoServico) => {
    setEditingId(item.id);
    setForm({ tipo: item.tipo, subtipo: item.subtipo, descricao: item.descricao });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.tipo || !form.subtipo) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha Tipo e SubTipo.",
        variant: "destructive",
      });
      return;
    }

    if (form.tipo.length > 50) {
      toast({ title: "Tipo deve ter no máximo 50 caracteres.", variant: "destructive" });
      return;
    }
    if (form.subtipo.length > 50) {
      toast({ title: "SubTipo deve ter no máximo 50 caracteres.", variant: "destructive" });
      return;
    }

    if (editingId) {
      setItems((prev) => prev.map((e) => (e.id === editingId ? { ...e, ...form } : e)));
      toast({ title: "Produto/Serviço atualizado com sucesso!" });
    } else {
      setItems((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
      toast({ title: "Produto/Serviço cadastrado com sucesso!" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setItems((prev) => prev.filter((e) => e.id !== deletingId));
      toast({ title: "Produto/Serviço excluído com sucesso!" });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <PackageSearch className="h-7 w-7 text-primary" />
              Produtos e Serviços
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie os produtos e serviços dos contratos
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto/Serviço
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por tipo, subtipo ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>SubTipo</TableHead>
                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nenhum produto ou serviço encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.tipo}</TableCell>
                    <TableCell>{item.subtipo}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      {item.descricao}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setDeletingId(item.id); setDeleteDialogOpen(true); }}
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Produto/Serviço" : "Novo Produto/Serviço"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Altere os dados abaixo." : "Preencha os dados para cadastrar."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo * (máx. 50 caracteres)</Label>
                <Input
                  id="tipo"
                  maxLength={50}
                  placeholder="Ex: Material de Consumo"
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtipo">SubTipo * (máx. 50 caracteres)</Label>
                <Input
                  id="subtipo"
                  maxLength={50}
                  placeholder="Ex: Material de Limpeza"
                  value={form.subtipo}
                  onChange={(e) => setForm({ ...form, subtipo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição do produto ou serviço"
                  rows={4}
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editingId ? "Salvar Alterações" : "Cadastrar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ProdutosServicos;
