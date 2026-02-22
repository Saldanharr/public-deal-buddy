import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
