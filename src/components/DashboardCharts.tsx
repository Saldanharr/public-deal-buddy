import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { initialLotes, produtosServicos, calcularValorItem } from "@/pages/Lotes";

const barData = [
  { month: "Jan", empenhos: 45, liquidacoes: 38 },
  { month: "Fev", empenhos: 52, liquidacoes: 42 },
  { month: "Mar", empenhos: 61, liquidacoes: 55 },
  { month: "Abr", empenhos: 48, liquidacoes: 44 },
  { month: "Mai", empenhos: 73, liquidacoes: 65 },
  { month: "Jun", empenhos: 58, liquidacoes: 50 },
];

const pieData = [
  { name: "Em Vigor", value: 42 },
  { name: "Encerrados", value: 18 },
  { name: "Em Aditivo", value: 12 },
  { name: "Pendentes", value: 8 },
];

const PIE_COLORS = [
  "hsl(220, 60%, 30%)",
  "hsl(160, 50%, 45%)",
  "hsl(40, 90%, 55%)",
  "hsl(280, 45%, 55%)",
];

const produtoServicoResumo = produtosServicos
  .map((produtoServico) => {
    const valorTotal = initialLotes.reduce((total, lote) => {
      const totalProdutoNoLote = lote.itens
        .filter((item) => item.produtoServicoId === produtoServico.id)
        .reduce((sum, item) => sum + calcularValorItem(item), 0);

      return total + totalProdutoNoLote;
    }, 0);

    return {
      nome: produtoServico.subtipo,
      descricao: produtoServico.descricao,
      tipo: produtoServico.tipo,
      valorTotal,
    };
  })
  .filter((item) => item.valorTotal > 0)
  .sort((a, b) => b.valorTotal - a.valorTotal);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

export const EmpenhoChart = () => (
  <div className="rounded-xl bg-card border border-border p-5 animate-fade-in">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-card-foreground">Empenhos vs Liquidações</h3>
        <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
      </div>
      <div className="flex gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Empenhos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-secondary" /> Liquidações
        </span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={barData} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
        <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0, 0%, 100%)",
            border: "1px solid hsl(214, 20%, 90%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="empenhos" fill="hsl(220, 60%, 30%)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="liquidacoes" fill="hsl(160, 50%, 45%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const ContratosChart = () => (
  <div className="rounded-xl bg-card border border-border p-5 animate-fade-in">
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-card-foreground">Status dos Contratos</h3>
      <p className="text-xs text-muted-foreground">Distribuição atual</p>
    </div>
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="50%" height={180}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={PIE_COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(214, 20%, 90%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {pieData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[index] }} />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-semibold text-card-foreground ml-auto">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ProdutosServicosResumo = () => (
  <div className="rounded-xl bg-card border border-border p-5 animate-fade-in">
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-sm font-semibold text-card-foreground">Resumo por Produto/Serviço</h3>
        <p className="text-xs text-muted-foreground">Valores totais agrupados nos lotes</p>
      </div>
      <span className="text-sm font-semibold text-primary">
        {formatCurrency(produtoServicoResumo.reduce((sum, item) => sum + item.valorTotal, 0))}
      </span>
    </div>
    <div className="space-y-3">
      {produtoServicoResumo.map((item) => (
        <div key={item.nome} className="grid gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-card-foreground">{item.nome}</p>
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{item.tipo}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.descricao}</p>
          </div>
          <p className="text-sm font-bold text-primary sm:text-right">{formatCurrency(item.valorTotal)}</p>
        </div>
      ))}
    </div>
  </div>
);
