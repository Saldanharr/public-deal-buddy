import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Filter,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import EmpenhoDetailView from "@/components/EmpenhoDetailView";

interface EmpenhoSaldo {
  id: string;
  numero: string;
  valorEmpenhado: number;
  valorLiquidado: number;
  saldo: number;
  elementoDespesa: string;
  elementoDespesaDesc: string;
  dataEmpenho: string;
  assunto: string;
  emendaParlamentar: boolean;
  autorEmenda: string;
  contratoNumero: string;
  contratoContratado: string;
}

const mockData: EmpenhoSaldo[] = [
  {
    id: "1",
    numero: "2024NE000123",
    valorEmpenhado: 150000.0,
    valorLiquidado: 87500.0,
    saldo: 62500.0,
    elementoDespesa: "339039",
    elementoDespesaDesc: "Serviços de Terceiros - PJ",
    dataEmpenho: "2024-03-15",
    assunto: "Aquisição de material de consumo para manutenção predial",
    emendaParlamentar: false,
    autorEmenda: "",
    contratoNumero: "CT-2024/001",
    contratoContratado: "ABC Ltda",
  },
  {
    id: "2",
    numero: "2024NE000456",
    valorEmpenhado: 87500.5,
    valorLiquidado: 87500.5,
    saldo: 0,
    elementoDespesa: "449052",
    elementoDespesaDesc: "Equipamentos e Material Permanente",
    dataEmpenho: "2024-04-20",
    assunto: "Aquisição de equipamentos de informática",
    emendaParlamentar: true,
    autorEmenda: "Dep. João Silva",
    contratoNumero: "CT-2024/002",
    contratoContratado: "Tech Solutions S.A.",
  },
  {
    id: "3",
    numero: "2024NE000789",
    valorEmpenhado: 320000.0,
    valorLiquidado: 160000.0,
    saldo: 160000.0,
    elementoDespesa: "339037",
    elementoDespesaDesc: "Locação de Mão de Obra",
    dataEmpenho: "2024-05-10",
    assunto: "Contratação de serviço de limpeza e conservação",
    emendaParlamentar: false,
    autorEmenda: "",
    contratoNumero: "CT-2024/003",
    contratoContratado: "Clean Service Eireli",
  },
  {
    id: "4",
    numero: "2024NE001002",
    valorEmpenhado: 45000.0,
    valorLiquidado: 12000.0,
    saldo: 33000.0,
    elementoDespesa: "339039",
    elementoDespesaDesc: "Serviços de Terceiros - PJ",
    dataEmpenho: "2024-06-01",
    assunto: "Serviço de manutenção de elevadores",
    emendaParlamentar: true,
    autorEmenda: "Sen. Maria Oliveira",
    contratoNumero: "CT-2024/001",
    contratoContratado: "ABC Ltda",
  },
  {
    id: "5",
    numero: "2024NE001100",
    valorEmpenhado: 210000.0,
    valorLiquidado: 0,
    saldo: 210000.0,
    elementoDespesa: "449052",
    elementoDespesaDesc: "Equipamentos e Material Permanente",
    dataEmpenho: "2024-07-15",
    assunto: "Aquisição de mobiliário para escritório",
    emendaParlamentar: false,
    autorEmenda: "",
    contratoNumero: "",
    contratoContratado: "",
  },
  {
    id: "6",
    numero: "2024NE001250",
    valorEmpenhado: 95000.0,
    valorLiquidado: 95000.0,
    saldo: 0,
    elementoDespesa: "339030",
    elementoDespesaDesc: "Material de Consumo",
    dataEmpenho: "2024-08-05",
    assunto: "Material de expediente e suprimentos",
    emendaParlamentar: true,
    autorEmenda: "Dep. Carlos Santos",
    contratoNumero: "CT-2024/004",
    contratoContratado: "Papelaria Brasil ME",
  },
];

const CHART_COLORS = [
  "hsl(220, 60%, 30%)",
  "hsl(160, 50%, 45%)",
  "hsl(40, 90%, 55%)",
  "hsl(0, 70%, 55%)",
  "hsl(270, 50%, 50%)",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatCurrencyShort = (value: number) => {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
  return formatCurrency(value);
};

const SaldoEmpenho = () => {
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroElemento, setFiltroElemento] = useState<string>("todos");
  const [filtroEmenda, setFiltroEmenda] = useState<string>("todos");
  const [filtroContrato, setFiltroContrato] = useState<string>("todos");
  const [viewingEmpenho, setViewingEmpenho] = useState<any>(null);

  // Unique filter values
  const elementos = [...new Set(mockData.map((e) => e.elementoDespesa))];
  const contratos = [...new Set(mockData.filter((e) => e.contratoNumero).map((e) => e.contratoNumero))];

  // Apply filters
  const filtered = mockData.filter((e) => {
    const matchSearch =
      e.numero.toLowerCase().includes(search.toLowerCase()) ||
      e.assunto.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "com-saldo" && e.saldo > 0) ||
      (filtroStatus === "sem-saldo" && e.saldo === 0);
    const matchElemento = filtroElemento === "todos" || e.elementoDespesa === filtroElemento;
    const matchEmenda =
      filtroEmenda === "todos" ||
      (filtroEmenda === "sim" && e.emendaParlamentar) ||
      (filtroEmenda === "nao" && !e.emendaParlamentar);
    const matchContrato =
      filtroContrato === "todos" ||
      (filtroContrato === "sem-contrato" && !e.contratoNumero) ||
      e.contratoNumero === filtroContrato;
    return matchSearch && matchStatus && matchElemento && matchEmenda && matchContrato;
  });

  // Totals
  const totalEmpenhado = filtered.reduce((s, e) => s + e.valorEmpenhado, 0);
  const totalLiquidado = filtered.reduce((s, e) => s + e.valorLiquidado, 0);
  const totalSaldo = filtered.reduce((s, e) => s + e.saldo, 0);
  const execucaoGeral = totalEmpenhado > 0 ? (totalLiquidado / totalEmpenhado) * 100 : 0;

  // Chart: by elemento de despesa
  const byElemento = elementos.map((el) => {
    const items = filtered.filter((e) => e.elementoDespesa === el);
    const desc = items[0]?.elementoDespesaDesc || el;
    return {
      name: el,
      desc,
      empenhado: items.reduce((s, e) => s + e.valorEmpenhado, 0),
      liquidado: items.reduce((s, e) => s + e.valorLiquidado, 0),
      saldo: items.reduce((s, e) => s + e.saldo, 0),
    };
  }).filter((d) => d.empenhado > 0);

  // Chart: emenda vs não emenda
  const emendaData = [
    {
      name: "Emenda Parlamentar",
      value: filtered.filter((e) => e.emendaParlamentar).reduce((s, e) => s + e.valorEmpenhado, 0),
    },
    {
      name: "Recurso Próprio",
      value: filtered.filter((e) => !e.emendaParlamentar).reduce((s, e) => s + e.valorEmpenhado, 0),
    },
  ].filter((d) => d.value > 0);

  const execucaoPercent = (e: EmpenhoSaldo) =>
    e.valorEmpenhado > 0 ? Math.round((e.valorLiquidado / e.valorEmpenhado) * 100) : 0;

  const clearFilters = () => {
    setFiltroStatus("todos");
    setFiltroElemento("todos");
    setFiltroEmenda("todos");
    setFiltroContrato("todos");
    setSearch("");
  };

  const hasActiveFilters =
    filtroStatus !== "todos" ||
    filtroElemento !== "todos" ||
    filtroEmenda !== "todos" ||
    filtroContrato !== "todos" ||
    search !== "";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wallet className="h-7 w-7 text-primary" />
            Saldo de Empenhos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhamento consolidado da execução financeira dos empenhos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Empenhado"
            value={formatCurrencyShort(totalEmpenhado)}
            subtitle={formatCurrency(totalEmpenhado)}
            icon={Receipt}
            variant="primary"
          />
          <StatsCard
            title="Total Liquidado"
            value={formatCurrencyShort(totalLiquidado)}
            subtitle={`${execucaoGeral.toFixed(1)}% executado`}
            icon={DollarSign}
            variant="secondary"
          />
          <StatsCard
            title="Saldo Disponível"
            value={formatCurrencyShort(totalSaldo)}
            subtitle={`${(100 - execucaoGeral).toFixed(1)}% disponível`}
            icon={TrendingUp}
            variant="accent"
          />
          <StatsCard
            title="Empenhos"
            value={filtered.length}
            subtitle={`${filtered.filter((e) => e.saldo === 0).length} sem saldo`}
            icon={TrendingDown}
            trend={{
              value: `${filtered.filter((e) => e.saldo > 0).length} com saldo`,
              positive: true,
            }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bar chart - by Elemento de Despesa */}
          <div className="lg:col-span-2 rounded-xl border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Execução por Elemento de Despesa
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byElemento} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => formatCurrencyShort(v)} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => {
                      const item = byElemento.find((d) => d.name === label);
                      return item ? `${label} - ${item.desc}` : label;
                    }}
                  />
                  <Bar dataKey="empenhado" name="Empenhado" fill="hsl(220, 60%, 30%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="liquidado" name="Liquidado" fill="hsl(160, 50%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saldo" name="Saldo" fill="hsl(40, 90%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart - Emenda vs Próprio */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Origem dos Recursos
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emendaData}
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    innerRadius={50}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {emendaData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Filtros</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">
                Limpar filtros
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="com-saldo">Com saldo</SelectItem>
                <SelectItem value="sem-saldo">Sem saldo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroElemento} onValueChange={setFiltroElemento}>
              <SelectTrigger>
                <SelectValue placeholder="Elemento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os elementos</SelectItem>
                {elementos.map((el) => (
                  <SelectItem key={el} value={el}>{el}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroEmenda} onValueChange={setFiltroEmenda}>
              <SelectTrigger>
                <SelectValue placeholder="Emenda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as origens</SelectItem>
                <SelectItem value="sim">Emenda Parlamentar</SelectItem>
                <SelectItem value="nao">Recurso Próprio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroContrato} onValueChange={setFiltroContrato}>
              <SelectTrigger>
                <SelectValue placeholder="Contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os contratos</SelectItem>
                <SelectItem value="sem-contrato">Sem contrato</SelectItem>
                {contratos.map((ct) => (
                  <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary text-primary-foreground [&>th]:text-primary-foreground">
                <TableHead>Emenda</TableHead>
                <TableHead>Nº Empenho</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Elem. Despesa</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead className="text-right">Empenhado</TableHead>
                <TableHead className="text-right">Liquidado</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead>Execução</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                    Nenhum empenho encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((empenho) => {
                  const exec = execucaoPercent(empenho);
                  return (
                    <TableRow key={empenho.id}>
                      <TableCell>
                        {empenho.emendaParlamentar ? (
                          <Badge variant="destructive" className="text-[10px]">
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">
                            Não
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{empenho.numero}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">{empenho.assunto}</p>
                          {empenho.emendaParlamentar && empenho.autorEmenda && (
                            <p className="text-xs text-muted-foreground/70 truncate">
                              {empenho.autorEmenda}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{empenho.elementoDespesa}</TableCell>
                      <TableCell className="text-sm">
                        {empenho.contratoNumero || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(empenho.valorEmpenhado)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-secondary">
                        {formatCurrency(empenho.valorLiquidado)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(empenho.saldo)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress value={exec} className="h-2 w-16" />
                          <span className="text-xs font-medium text-muted-foreground">
                            {exec}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={empenho.saldo > 0 ? "outline" : "default"}
                          className={
                            empenho.saldo > 0
                              ? "border-accent text-accent-foreground bg-accent/20 text-[10px]"
                              : "bg-primary/10 text-primary border-0 text-[10px]"
                          }
                        >
                          {empenho.saldo > 0 ? "Com Saldo" : "Sem Saldo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setViewingEmpenho({
                              id: empenho.id,
                              numero: empenho.numero,
                              valor: empenho.valorEmpenhado,
                              elementoDespesa: empenho.elementoDespesa,
                              dataEmpenho: empenho.dataEmpenho,
                              assunto: empenho.assunto,
                              emendaParlamentar: empenho.emendaParlamentar,
                              autorEmenda: empenho.autorEmenda,
                            })
                          }
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Totals footer */}
        <div className="rounded-xl border bg-card p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Registros</p>
              <p className="text-lg font-bold text-foreground">{filtered.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Empenhado</p>
              <p className="text-lg font-bold text-primary">{formatCurrencyShort(totalEmpenhado)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Liquidado</p>
              <p className="text-lg font-bold text-secondary">{formatCurrencyShort(totalLiquidado)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Saldo Total</p>
              <p className="text-lg font-bold text-accent-foreground">{formatCurrencyShort(totalSaldo)}</p>
            </div>
          </div>
        </div>

        <EmpenhoDetailView
          empenho={viewingEmpenho}
          open={!!viewingEmpenho}
          onOpenChange={(open) => !open && setViewingEmpenho(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default SaldoEmpenho;
