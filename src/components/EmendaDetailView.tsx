import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Receipt,
  FileText,
  DollarSign,
  Landmark,
  ScrollText,
  Package,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building2,
  User,
  TrendingUp,
  CircleDot,
} from "lucide-react";
import { useState } from "react";

// ---- Interfaces ----

interface EmpenhoData {
  id: string;
  numero: string;
  valor: number;
  elementoDespesa: string;
  dataEmpenho: string;
  assunto: string;
  emendaParlamentar: boolean;
  autorEmenda: string;
  processoId?: string;
  contratoId?: string;
}

interface ProcessoData {
  id: string;
  nup: string;
  dataCriacao: string;
  departamentoGestor: string;
  sigla: string;
  assunto: string;
  interessado: string;
}

interface LiquidacaoData {
  id: string;
  numero: string;
  empenhoIds: string[];
  descricao: string;
  valorTotal: number;
  dataLiquidacao: string;
}

interface ContratoData {
  id: string;
  numero: string;
  contratado: string;
  objeto: string;
  processoId: string;
  valorTotal: number;
  vigenciaFim: string;
  rescindido: boolean;
}

interface LoteData {
  id: string;
  numero: string;
  descricao: string;
  contratoId: string;
  valor: number;
}

interface EmendaInfo {
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

// ---- Mock data ----

const mockEmpenhos: EmpenhoData[] = [
  {
    id: "1",
    numero: "2024NE000123",
    valor: 150000.0,
    elementoDespesa: "339039",
    dataEmpenho: "2024-03-15",
    assunto: "Aquisição de material de consumo para manutenção predial",
    emendaParlamentar: false,
    autorEmenda: "",
    processoId: "1",
    contratoId: "1",
  },
  {
    id: "2",
    numero: "2024NE000456",
    valor: 87500.5,
    elementoDespesa: "449052",
    dataEmpenho: "2024-04-20",
    assunto: "Aquisição de equipamentos de informática",
    emendaParlamentar: true,
    autorEmenda: "Sen. Maria Souza",
    processoId: "1",
    contratoId: "1",
  },
  {
    id: "3",
    numero: "2024NE000789",
    valor: 320000.0,
    elementoDespesa: "339037",
    dataEmpenho: "2024-05-10",
    assunto: "Contratação de serviço de limpeza e conservação",
    emendaParlamentar: true,
    autorEmenda: "Sen. Maria Souza",
    processoId: "2",
    contratoId: "2",
  },
  {
    id: "4",
    numero: "2024NE001010",
    valor: 215000.0,
    elementoDespesa: "449052",
    dataEmpenho: "2024-06-05",
    assunto: "Aquisição de mobiliário escolar para escola municipal",
    emendaParlamentar: true,
    autorEmenda: "Sen. Maria Souza",
    processoId: "3",
    contratoId: "3",
  },
  {
    id: "5",
    numero: "2024NE001122",
    valor: 180000.0,
    elementoDespesa: "339030",
    dataEmpenho: "2024-07-12",
    assunto: "Material didático e pedagógico para unidades escolares",
    emendaParlamentar: true,
    autorEmenda: "Sen. Maria Souza",
    processoId: "3",
    contratoId: "4",
  },
  {
    id: "6",
    numero: "2024NE001350",
    valor: 450000.0,
    elementoDespesa: "449051",
    dataEmpenho: "2024-08-20",
    assunto: "Obras de infraestrutura — construção de quadra poliesportiva",
    emendaParlamentar: true,
    autorEmenda: "Sen. Maria Souza",
    processoId: "4",
    contratoId: "5",
  },
];

const mockProcessos: ProcessoData[] = [
  {
    id: "1",
    nup: "00100000001",
    dataCriacao: "2024-01-10",
    departamentoGestor: "DLOG",
    sigla: "PROC-001",
    assunto: "Aquisição de materiais e equipamentos",
    interessado: "Departamento de Logística",
  },
  {
    id: "2",
    nup: "00100000002",
    dataCriacao: "2024-02-15",
    departamentoGestor: "DTIC",
    sigla: "PROC-002",
    assunto: "Contratação de serviços continuados",
    interessado: "Departamento de TIC",
  },
  {
    id: "3",
    nup: "00100000003",
    dataCriacao: "2024-04-01",
    departamentoGestor: "DEDU",
    sigla: "PROC-003",
    assunto: "Equipamento e material didático para escola municipal",
    interessado: "Secretaria de Educação",
  },
  {
    id: "4",
    nup: "00100000004",
    dataCriacao: "2024-05-20",
    departamentoGestor: "DOBR",
    sigla: "PROC-004",
    assunto: "Construção de quadra poliesportiva — Distrito Rural",
    interessado: "Secretaria de Infraestrutura",
  },
];

const mockContratos: ContratoData[] = [
  {
    id: "1",
    numero: "CT-2024-001",
    contratado: "Empresa ABC Ltda",
    objeto: "Fornecimento de materiais e equipamentos de informática",
    processoId: "1",
    valorTotal: 250000,
    vigenciaFim: "2025-03-15",
    rescindido: false,
  },
  {
    id: "2",
    numero: "CT-2024-002",
    contratado: "Serviços XYZ S.A.",
    objeto: "Prestação de serviços de limpeza e conservação",
    processoId: "2",
    valorTotal: 480000,
    vigenciaFim: "2025-06-30",
    rescindido: false,
  },
  {
    id: "3",
    numero: "CT-2024-003",
    contratado: "Mobília Escolar Brasil Ltda",
    objeto: "Fornecimento de mesas, cadeiras e armários escolares",
    processoId: "3",
    valorTotal: 215000,
    vigenciaFim: "2025-04-30",
    rescindido: false,
  },
  {
    id: "4",
    numero: "CT-2024-004",
    contratado: "Editora Saber S.A.",
    objeto: "Fornecimento de livros e material didático",
    processoId: "3",
    valorTotal: 180000,
    vigenciaFim: "2025-05-15",
    rescindido: false,
  },
  {
    id: "5",
    numero: "CT-2024-005",
    contratado: "Construtora Horizonte Ltda",
    objeto: "Construção de quadra poliesportiva coberta",
    processoId: "4",
    valorTotal: 450000,
    vigenciaFim: "2025-12-31",
    rescindido: false,
  },
];

const mockLiquidacoes: LiquidacaoData[] = [
  {
    id: "1",
    numero: "LIQ-2024-001",
    empenhoIds: ["1", "2"],
    descricao: "Liquidação referente à entrega parcial de materiais e equipamentos",
    valorTotal: 55000.0,
    dataLiquidacao: "2024-07-15",
  },
  {
    id: "2",
    numero: "LIQ-2024-002",
    empenhoIds: ["3"],
    descricao: "Liquidação de serviço de limpeza - mês de maio",
    valorTotal: 26000.0,
    dataLiquidacao: "2024-06-05",
  },
  {
    id: "3",
    numero: "LIQ-2024-003",
    empenhoIds: ["4"],
    descricao: "Liquidação parcial — entrega de mobiliário escolar (1ª remessa)",
    valorTotal: 95000.0,
    dataLiquidacao: "2024-09-10",
  },
  {
    id: "4",
    numero: "LIQ-2024-004",
    empenhoIds: ["5"],
    descricao: "Liquidação de material didático — entrega integral",
    valorTotal: 180000.0,
    dataLiquidacao: "2024-10-01",
  },
  {
    id: "5",
    numero: "LIQ-2024-005",
    empenhoIds: ["6"],
    descricao: "Liquidação parcial — medição 1ª etapa obra quadra poliesportiva",
    valorTotal: 135000.0,
    dataLiquidacao: "2024-11-15",
  },
];

const mockLotes: LoteData[] = [
  { id: "1", numero: "LT-001", descricao: "Material de Limpeza", contratoId: "1", valor: 15000 },
  { id: "2", numero: "LT-002", descricao: "Equipamentos de Informática", contratoId: "1", valor: 87500 },
  { id: "3", numero: "LT-003", descricao: "Serviço de Manutenção Predial", contratoId: "2", valor: 120000 },
  { id: "4", numero: "LT-004", descricao: "Mesas e Cadeiras Escolares", contratoId: "3", valor: 130000 },
  { id: "5", numero: "LT-005", descricao: "Armários e Estantes", contratoId: "3", valor: 85000 },
  { id: "6", numero: "LT-006", descricao: "Livros Didáticos", contratoId: "4", valor: 110000 },
  { id: "7", numero: "LT-007", descricao: "Material Pedagógico Complementar", contratoId: "4", valor: 70000 },
  { id: "8", numero: "LT-008", descricao: "Fundação e Estrutura", contratoId: "5", valor: 200000 },
  { id: "9", numero: "LT-009", descricao: "Cobertura e Acabamento", contratoId: "5", valor: 250000 },
];

// ---- Helpers ----

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
};

// ---- Sub-section Item ----

const SubItem = ({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  value,
  badge,
  badgeVariant,
  extra,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  subtitle?: string;
  value?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  extra?: React.ReactNode;
}) => (
  <div className="group relative flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3 transition-all duration-200 hover:shadow-md hover:border-border">
    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconColor}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0 space-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm text-foreground truncate">{title}</span>
        {badge && (
          <Badge variant={badgeVariant || "secondary"} className="text-[10px] shrink-0">
            {badge}
          </Badge>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      {value && <p className="text-xs font-semibold text-primary">{value}</p>}
      {extra}
    </div>
  </div>
);

// ---- Section within timeline node ----

const TimelineSection = ({
  icon: Icon,
  label,
  color,
  children,
  count,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  children: React.ReactNode;
  count: number;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative ml-5 mt-3">
      {/* Horizontal branch line */}
      <div className="absolute -left-5 top-3 w-5 h-px bg-border" />
      {/* Small dot at branch */}
      <div className={`absolute -left-[22px] top-[9px] w-[5px] h-[5px] rounded-full ${color}`} />

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-2 group/section"
      >
        <div className={`flex h-6 w-6 items-center justify-center rounded-md ${color} transition-colors`}>
          <Icon className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="text-xs font-bold text-foreground uppercase tracking-wider">{label}</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">{count}</Badge>
        {open ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
      </button>

      {open && (
        <div className="grid gap-2 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

// ---- Timeline Process Node ----

const ProcessoTimelineNode = ({
  processo,
  empenhos,
  contratos,
  liquidacoes,
  lotes,
  index,
  isLast,
}: {
  processo: ProcessoData;
  empenhos: EmpenhoData[];
  contratos: ContratoData[];
  liquidacoes: LiquidacaoData[];
  lotes: LoteData[];
  index: number;
  isLast: boolean;
}) => {
  const [expanded, setExpanded] = useState(true);
  const totalValor = empenhos.reduce((s, e) => s + e.valor, 0);

  return (
    <div className="relative flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Left spine */}
      <div className="flex flex-col items-center">
        {/* Main node */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform duration-200 hover:scale-110"
        >
          <FileText className="h-5 w-5" />
        </button>
        {/* Vertical connector */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-border min-h-[24px]" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? "" : ""}`}>
        {/* Process header card */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-foreground">{processo.sigla}</h4>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  NUP {processo.nup}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{processo.assunto}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(processo.dataCriacao)}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {processo.departamentoGestor}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {processo.interessado}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-sm font-bold text-primary">{formatCurrency(totalValor)}</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-[10px]">{empenhos.length} emp · {contratos.length} ct · {liquidacoes.length} liq</span>
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </div>
            </div>
          </div>
        </button>

        {/* Expanded sub-sections */}
        {expanded && (
          <div className="relative mt-1 ml-1 border-l-2 border-border/50 pl-1 space-y-1 animate-fade-in">
            {/* Contratos */}
            {contratos.length > 0 && (
              <TimelineSection icon={ScrollText} label="Contratos" color="bg-secondary" count={contratos.length}>
                {contratos.map((c) => (
                  <SubItem
                    key={c.id}
                    icon={ScrollText}
                    iconColor="bg-secondary/15 text-secondary"
                    title={c.numero}
                    subtitle={`${c.contratado} — ${c.objeto}`}
                    value={formatCurrency(c.valorTotal)}
                    badge={c.rescindido ? "Rescindido" : "Ativo"}
                    badgeVariant={c.rescindido ? "destructive" : "outline"}
                    extra={
                      <span className="text-[10px] text-muted-foreground">
                        Vigência até {formatDate(c.vigenciaFim)}
                      </span>
                    }
                  />
                ))}
              </TimelineSection>
            )}

            {/* Empenhos */}
            {empenhos.length > 0 && (
              <TimelineSection icon={Receipt} label="Empenhos" color="bg-accent" count={empenhos.length}>
                {empenhos.map((e) => {
                  const exec = 65 + Math.floor(Math.random() * 35);
                  return (
                    <SubItem
                      key={e.id}
                      icon={Receipt}
                      iconColor="bg-accent/15 text-accent-foreground"
                      title={e.numero}
                      subtitle={e.assunto}
                      value={formatCurrency(e.valor)}
                      badge={exec < 100 ? "Com Saldo" : "Sem Saldo"}
                      badgeVariant={exec < 100 ? "secondary" : "destructive"}
                      extra={
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] text-muted-foreground">ED: {e.elementoDespesa}</span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(e.dataEmpenho)}</span>
                          <div className="flex items-center gap-1 ml-auto">
                            <Progress value={exec} className="h-1.5 w-14" />
                            <span className="text-[10px] font-medium text-muted-foreground">{exec}%</span>
                          </div>
                        </div>
                      }
                    />
                  );
                })}
              </TimelineSection>
            )}

            {/* Liquidações */}
            {liquidacoes.length > 0 && (
              <TimelineSection icon={DollarSign} label="Liquidações" color="bg-primary" count={liquidacoes.length}>
                {liquidacoes.map((l) => (
                  <SubItem
                    key={l.id}
                    icon={DollarSign}
                    iconColor="bg-primary/15 text-primary"
                    title={l.numero}
                    subtitle={l.descricao}
                    value={formatCurrency(l.valorTotal)}
                    extra={
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(l.dataLiquidacao)}
                      </span>
                    }
                  />
                ))}
              </TimelineSection>
            )}

            {/* Lotes */}
            {lotes.length > 0 && (
              <TimelineSection icon={Package} label="Lotes" color="bg-destructive" count={lotes.length}>
                {lotes.map((l) => (
                  <SubItem
                    key={l.id}
                    icon={Package}
                    iconColor="bg-destructive/15 text-destructive"
                    title={l.numero}
                    subtitle={l.descricao}
                    value={formatCurrency(l.valor)}
                  />
                ))}
              </TimelineSection>
            )}

            {contratos.length === 0 && empenhos.length === 0 && liquidacoes.length === 0 && lotes.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4 ml-5">
                Nenhum vínculo encontrado para este processo.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Main Component ----

interface EmendaDetailViewProps {
  emenda: EmendaInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmendaDetailView = ({ emenda, open, onOpenChange }: EmendaDetailViewProps) => {
  if (!emenda) return null;

  const relatedEmpenhos = mockEmpenhos.filter((e) => emenda.empenhoIds.includes(e.id));
  const processoIds = [...new Set(relatedEmpenhos.map((e) => e.processoId).filter(Boolean))];
  const relatedProcessos = mockProcessos.filter((p) => processoIds.includes(p.id));

  const getProcessoData = (processoId: string) => {
    const procEmpenhos = relatedEmpenhos.filter((e) => e.processoId === processoId);
    const procEmpenhoIds = new Set(procEmpenhos.map((e) => e.id));
    const procContratoIds = [...new Set(procEmpenhos.map((e) => e.contratoId).filter(Boolean))];
    const procContratos = mockContratos.filter((c) => procContratoIds.includes(c.id));
    const procLiquidacoes = mockLiquidacoes.filter((l) =>
      l.empenhoIds.some((eid) => procEmpenhoIds.has(eid))
    );
    const allContratoIds = new Set(procContratos.map((c) => c.id));
    const procLotes = mockLotes.filter((l) => allContratoIds.has(l.contratoId));
    return { empenhos: procEmpenhos, contratos: procContratos, liquidacoes: procLiquidacoes, lotes: procLotes };
  };

  const totalEmpenhos = relatedEmpenhos.reduce((s, e) => s + e.valor, 0);
  const totalLiquidado = mockLiquidacoes
    .filter((l) => l.empenhoIds.some((eid) => relatedEmpenhos.some((e) => e.id === eid)))
    .reduce((s, l) => s + l.valorTotal, 0);
  const percentExec = totalEmpenhos > 0 ? Math.round((totalLiquidado / totalEmpenhos) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
        {/* Hero header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-primary-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/20">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold">Emenda {emenda.codigo}</span>
                <p className="text-xs font-normal opacity-80 mt-0.5">Nº {emenda.numeroEmenda} · {emenda.anoEmenda} · {emenda.tipo}</p>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalhes da emenda parlamentar e vínculos
            </DialogDescription>
          </DialogHeader>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="rounded-lg bg-primary-foreground/10 backdrop-blur-sm p-3">
              <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Autor</p>
              <p className="font-semibold text-sm">{emenda.autor}</p>
              <p className="text-[10px] opacity-70">{emenda.cargoAutor}</p>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 backdrop-blur-sm p-3">
              <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Valor da Emenda</p>
              <p className="font-bold text-sm">{formatCurrency(emenda.valor)}</p>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 backdrop-blur-sm p-3">
              <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Total Empenhado</p>
              <p className="font-bold text-sm">{formatCurrency(totalEmpenhos)}</p>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 backdrop-blur-sm p-3">
              <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Execução</p>
              <div className="flex items-center gap-2">
                <Progress value={percentExec} className="h-2 flex-1 bg-primary-foreground/20" />
                <span className="font-bold text-sm">{percentExec}%</span>
              </div>
              <p className="text-[10px] opacity-70 mt-0.5">{formatCurrency(totalLiquidado)} liquidado</p>
            </div>
          </div>

          {emenda.objeto && (
            <p className="text-xs opacity-80 mt-3 leading-relaxed">
              <strong>Objeto:</strong> {emenda.objeto}
            </p>
          )}
        </div>

        {/* Timeline body */}
        <div className="p-6">
          {relatedProcessos.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-sm">
              <CircleDot className="h-8 w-8 mx-auto mb-2 opacity-40" />
              Nenhum processo vinculado a esta emenda.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Fluxo de Execução
                </h3>
                <Badge variant="secondary" className="text-[10px]">{relatedProcessos.length} processos</Badge>
              </div>

              <div className="relative">
                {relatedProcessos.map((proc, index) => {
                  const data = getProcessoData(proc.id);
                  return (
                    <ProcessoTimelineNode
                      key={proc.id}
                      processo={proc}
                      empenhos={data.empenhos}
                      contratos={data.contratos}
                      liquidacoes={data.liquidacoes}
                      lotes={data.lotes}
                      index={index}
                      isLast={index === relatedProcessos.length - 1}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmendaDetailView;
