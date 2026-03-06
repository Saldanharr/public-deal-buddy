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
import { Plus, Pencil, Trash2, Search, Layers, Eye } from "lucide-react";
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

interface Lote {
  id: string;
  contratoId: string;
  produtoServicoId: string;
  quantidade: number;
  valor: number;
  previsaoEntrega: string;
  entregue: boolean;
  dataEntrega: string;
}

const produtosServicos: ProdutoServico[] = [
  { id: "1", tipo: "Material de Consumo", subtipo: "Material de Limpeza", descricao: "Produtos de limpeza para manutenção predial" },
  { id: "2", tipo: "Serviço", subtipo: "Manutenção Predial", descricao: "Serviço de manutenção corretiva e preventiva" },
  { id: "3", tipo: "Equipamento", subtipo: "Informática", descricao: "Computadores, monitores e periféricos" },
];

const contratosMock: ContratoRef[] = [
  { id: "1", numero: "CT-2024-000001" },
  { id: "2", numero: "CT-2024-000002" },
];

const initialLotes: Lote[] = [
  {
    id: "1",
    contratoId: "1",
    produtoServicoId: "1",
    quantidade: 100.0000,
    valor: 25000.5000,
    previsaoEntrega: "2024-06-30",
    entregue: true,
    dataEntrega: "2024-06-28",
  },
  {
    id: "2",
    contratoId: "1",
    produtoServicoId: "3",
    quantidade: 50.0000,
    valor: 87500.0000,
    previsaoEntrega: "2024-08-15",
    entregue: false,
    dataEntrega: "",
  },
  {
    id: "3",
    contratoId: "2",
    produtoServicoId: "2",
    quantidade: 1.0000,
    valor: 120000.7500,
    previsaoEntrega: "2024-09-01",
    entregue: false,
    dataEntrega: "",
  },
];

const emptyForm: Omit<Lote, "id"> = {
  contratoId: "",
  produtoServicoId: "",
  quantidade: 0,
  valor: 0,
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
  const [form, setForm] = useState<Omit<Lote, "id">>(emptyForm);
  const [viewingLote, setViewingLote] = useState<Lote | null>(null);
  const { toast } = useToast();

  const getProdutoServico = (id: string) =>
    produtosServicos.find((ps) => ps.id === id);

  const getProdutoServicoTipoSubtipo = (id: string) => {
    const ps = getProdutoServico(id);
    return ps ? `${ps.tipo} - ${ps.subtipo}` : "—";
  };

  const getProdutoServicoDescricao = (id: string) => {
    const ps = getProdutoServico(id);
    return ps ? ps.descricao : "—";
  };

  const getContratoNumero = (id: string) => {
    const c = contratosMock.find((ct) => ct.id === id);
    return c ? c.numero : "—";
  };

  const filtered = lotes.filter((lote) => {
    const ps = getProdutoServico(lote.produtoServicoId);
    const psText = ps ? `${ps.tipo} ${ps.subtipo} ${ps.descricao}` : "";
    return psText.toLowerCase().includes(search.toLowerCase()) ||
      lote.valor.toString().includes(search);
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (lote: Lote) => {
    setEditingId(lote.id);
    setForm({
      contratoId: lote.contratoId,
      produtoServicoId: lote.produtoServicoId,
      quantidade: lote.quantidade,
      valor: lote.valor,
      previsaoEntrega: lote.previsaoEntrega,
      entregue: lote.entregue,
      dataEntrega: lote.dataEntrega,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.contratoId || !form.produtoServicoId || !form.previsaoEntrega) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o Contrato, o Produto/Serviço e a Previsão de Entrega.",
        variant: "destructive",
      });
      return;
    }

    if (form.entregue && !form.dataEntrega) {
      toast({
        title: "Data de entrega obrigatória",
        description: "Informe a data da entrega quando o lote estiver marcado como entregue.",
        variant: "destructive",
      });
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
              Gerencie os lotes vinculados a contratos e produtos/serviços
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
                <TableHead>Tipo/Subtipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Prev. Entrega</TableHead>
                <TableHead>Entregue</TableHead>
                <TableHead>Data Entrega</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Nenhum lote encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((lote) => (
                  <TableRow key={lote.id}>
                    <TableCell className="font-medium">{getContratoNumero(lote.contratoId)}</TableCell>
                    <TableCell>{getProdutoServicoTipoSubtipo(lote.produtoServicoId)}</TableCell>
                    <TableCell>{getProdutoServicoDescricao(lote.produtoServicoId)}</TableCell>
                    <TableCell>{lote.quantidade.toFixed(4)}</TableCell>
                    <TableCell>{formatCurrency(lote.valor)}</TableCell>
                    <TableCell>{formatDate(lote.previsaoEntrega)}</TableCell>
                    <TableCell>
                      {lote.entregue ? (
                        <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                          Sim
                        </span>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setDeletingId(lote.id); setDeleteDialogOpen(true); }}
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Lote" : "Novo Lote"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Altere os dados do lote abaixo." : "Preencha os dados para cadastrar um novo lote."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Contrato *</Label>
                <Select
                  value={form.contratoId}
                  onValueChange={(value) => setForm({ ...form, contratoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contratosMock.map((ct) => (
                      <SelectItem key={ct.id} value={ct.id}>
                        {ct.numero}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição do Lote (Produto/Serviço) *</Label>
                <Select
                  value={form.produtoServicoId}
                  onValueChange={(value) => setForm({ ...form, produtoServicoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto/serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtosServicos.map((ps) => (
                      <SelectItem key={ps.id} value={ps.id}>
                        {ps.tipo} - {ps.subtipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade *</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.0000"
                    value={form.quantidade || ""}
                    onChange={(e) =>
                      setForm({ ...form, quantidade: parseFloat(parseFloat(e.target.value).toFixed(4)) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor do Lote (R$) *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="previsaoEntrega">Previsão de Entrega *</Label>
                  <Input
                    id="previsaoEntrega"
                    type="date"
                    value={form.previsaoEntrega}
                    onChange={(e) => setForm({ ...form, previsaoEntrega: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Checkbox
                  id="entregue"
                  checked={form.entregue}
                  onCheckedChange={(checked) =>
                    setForm({
                      ...form,
                      entregue: !!checked,
                      dataEntrega: checked ? form.dataEntrega : "",
                    })
                  }
                />
                <Label htmlFor="entregue" className="cursor-pointer">
                  Entregue
                </Label>
              </div>

              {form.entregue && (
                <div className="space-y-2">
                  <Label htmlFor="dataEntrega">Data da Entrega *</Label>
                  <Input
                    id="dataEntrega"
                    type="date"
                    value={form.dataEntrega}
                    onChange={(e) => setForm({ ...form, dataEntrega: e.target.value })}
                  />
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
              <DialogDescription>
                Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.
              </DialogDescription>
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
