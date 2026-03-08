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
    autorEmenda: "Dep. João Silva",
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
    emendaParlamentar: false,
    autorEmenda: "",
    processoId: "2",
    contratoId: "2",
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
];

const mockLotes: LoteData[] = [
  { id: "1", numero: "LT-001", descricao: "Material de Limpeza", contratoId: "1", valor: 15000 },
  { id: "2", numero: "LT-002", descricao: "Equipamentos de Informática", contratoId: "1", valor: 87500 },
  { id: "3", numero: "LT-003", descricao: "Serviço de Manutenção Predial", contratoId: "2", valor: 120000 },
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

// Timeline node colors cycling
const timelineColors = [
  { bg: "bg-primary", border: "border-primary", text: "text-primary", light: "bg-primary/10" },
  { bg: "bg-secondary", border: "border-secondary", text: "text-secondary", light: "bg-secondary/10" },
  { bg: "bg-accent", border: "border-accent", text: "text-accent", light: "bg-accent/10" },
  { bg: "bg-destructive", border: "border-destructive", text: "text-destructive", light: "bg-destructive/10" },
];

// ---- Sub-components ----

const SectionHeader = ({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
}) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <Badge variant="secondary" className="text-xs">{count}</Badge>
  </div>
);

const ContratoCard = ({ contrato }: { contrato: ContratoData }) => (
  <div className="rounded-md border bg-card p-3 space-y-1">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-sm">{contrato.numero}</span>
      <Badge variant={contrato.rescindido ? "destructive" : "outline"} className="text-xs">
        {contrato.rescindido ? "Rescindido" : "Ativo"}
      </Badge>
    </div>
    <p className="text-xs text-muted-foreground truncate">{contrato.contratado}</p>
    <p className="text-xs text-muted-foreground truncate">{contrato.objeto}</p>
    <div className="flex items-center justify-between pt-1">
      <span className="text-xs font-medium text-primary">{formatCurrency(contrato.valorTotal)}</span>
      <span className="text-xs text-muted-foreground">Vigência: {formatDate(contrato.vigenciaFim)}</span>
    </div>
  </div>
);

const EmpenhoCard = ({ empenho }: { empenho: EmpenhoData }) => {
  const execucao = Math.floor(Math.random() * 101);
  return (
    <div className="rounded-md border bg-card p-3 space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{empenho.numero}</span>
        <Badge variant={execucao < 100 ? "secondary" : "destructive"} className="text-xs">
          {execucao < 100 ? "Com Saldo" : "Sem Saldo"}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground truncate">{empenho.assunto}</p>
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-medium text-primary">{formatCurrency(empenho.valor)}</span>
        <div className="flex items-center gap-1.5">
          <Progress value={execucao} className="h-1.5 w-12" />
          <span className="text-[10px] text-muted-foreground">{execucao}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">ED: {empenho.elementoDespesa}</span>
        <span className="text-[10px] text-muted-foreground">{formatDate(empenho.dataEmpenho)}</span>
      </div>
    </div>
  );
};

const LiquidacaoCard = ({ liquidacao }: { liquidacao: LiquidacaoData }) => (
  <div className="rounded-md border bg-card p-3 space-y-1">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-sm">{liquidacao.numero}</span>
      <span className="text-xs text-muted-foreground">{formatDate(liquidacao.dataLiquidacao)}</span>
    </div>
    <p className="text-xs text-muted-foreground truncate">{liquidacao.descricao}</p>
    <span className="text-xs font-medium text-primary">{formatCurrency(liquidacao.valorTotal)}</span>
  </div>
);

const LoteCard = ({ lote }: { lote: LoteData }) => (
  <div className="rounded-md border bg-card p-3 space-y-1">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-sm">{lote.numero}</span>
    </div>
    <p className="text-xs text-muted-foreground truncate">{lote.descricao}</p>
    <span className="text-xs font-medium text-primary">{formatCurrency(lote.valor)}</span>
  </div>
);

// ---- Timeline Node ----

interface TimelineNodeProps {
  processo: ProcessoData;
  empenhos: EmpenhoData[];
  contratos: ContratoData[];
  liquidacoes: LiquidacaoData[];
  lotes: LoteData[];
  colorIndex: number;
  isLast: boolean;
  side: "left" | "right";
}

const TimelineNode = ({
  processo,
  empenhos,
  contratos,
  liquidacoes,
  lotes,
  colorIndex,
  isLast,
  side,
}: TimelineNodeProps) => {
  const [expanded, setExpanded] = useState(true);
  const color = timelineColors[colorIndex % timelineColors.length];

  return (
    <div className="relative flex items-start gap-0">
      {/* Left content (if side === left, show card; otherwise empty spacer) */}
      <div className={`flex-1 ${side === "right" ? "hidden sm:block" : ""}`}>
        {side === "left" && (
          <div className="pr-6 pb-4">
            <TimelineCard
              processo={processo}
              empenhos={empenhos}
              contratos={contratos}
              liquidacoes={liquidacoes}
              lotes={lotes}
              color={color}
              expanded={expanded}
              onToggle={() => setExpanded(!expanded)}
            />
          </div>
        )}
      </div>

      {/* Center spine */}
      <div className="relative flex flex-col items-center z-10">
        {/* Node circle */}
        <div
          className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center shadow-md border-4 border-background cursor-pointer`}
          onClick={() => setExpanded(!expanded)}
        >
          <FileText className="h-4 w-4 text-primary-foreground" />
        </div>
        {/* Vertical line below */}
        {!isLast && (
          <div className="w-0.5 bg-border flex-1 min-h-[40px]" />
        )}
      </div>

      {/* Right content */}
      <div className={`flex-1 ${side === "left" ? "hidden sm:block" : ""}`}>
        {side === "right" && (
          <div className="pl-6 pb-4">
            <TimelineCard
              processo={processo}
              empenhos={empenhos}
              contratos={contratos}
              liquidacoes={liquidacoes}
              lotes={lotes}
              color={color}
              expanded={expanded}
              onToggle={() => setExpanded(!expanded)}
            />
          </div>
        )}
        {/* On mobile, always show on right if side is left */}
        {side === "left" && (
          <div className="pl-6 pb-4 sm:hidden">
            <TimelineCard
              processo={processo}
              empenhos={empenhos}
              contratos={contratos}
              liquidacoes={liquidacoes}
              lotes={lotes}
              color={color}
              expanded={expanded}
              onToggle={() => setExpanded(!expanded)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Timeline Card ----

interface TimelineCardProps {
  processo: ProcessoData;
  empenhos: EmpenhoData[];
  contratos: ContratoData[];
  liquidacoes: LiquidacaoData[];
  lotes: LoteData[];
  color: (typeof timelineColors)[0];
  expanded: boolean;
  onToggle: () => void;
}

const TimelineCard = ({
  processo,
  empenhos,
  contratos,
  liquidacoes,
  lotes,
  color,
  expanded,
  onToggle,
}: TimelineCardProps) => (
  <div className={`rounded-lg border-2 ${color.border} ${color.light} shadow-sm overflow-hidden animate-fade-in`}>
    {/* Card header */}
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3 ${color.bg} text-primary-foreground`}
    >
      <div className="flex items-center gap-2 text-left">
        <FileText className="h-4 w-4 shrink-0" />
        <div>
          <p className="font-bold text-sm">{processo.sigla}</p>
          <p className="text-xs opacity-90">NUP: {processo.nup}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-background/20 text-primary-foreground border-primary-foreground/30 text-[10px]">
          {formatDate(processo.dataCriacao)}
        </Badge>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
    </button>

    {/* Card body */}
    {expanded && (
      <div className="p-4 space-y-4">
        {/* Processo info */}
        <div className="text-sm space-y-1">
          <p className="text-muted-foreground text-xs">{processo.assunto}</p>
          <div className="flex gap-3 text-xs">
            <span><strong>Gestor:</strong> {processo.departamentoGestor}</span>
            <span><strong>Interessado:</strong> {processo.interessado}</span>
          </div>
        </div>

        {/* Contratos */}
        {contratos.length > 0 && (
          <div>
            <SectionHeader icon={ScrollText} label="Contratos" count={contratos.length} />
            <div className="grid gap-2">
              {contratos.map((c) => (
                <ContratoCard key={c.id} contrato={c} />
              ))}
            </div>
          </div>
        )}

        {/* Empenhos */}
        {empenhos.length > 0 && (
          <div>
            <SectionHeader icon={Receipt} label="Empenhos" count={empenhos.length} />
            <div className="grid gap-2 sm:grid-cols-2">
              {empenhos.map((e) => (
                <EmpenhoCard key={e.id} empenho={e} />
              ))}
            </div>
          </div>
        )}

        {/* Liquidações */}
        {liquidacoes.length > 0 && (
          <div>
            <SectionHeader icon={DollarSign} label="Liquidações" count={liquidacoes.length} />
            <div className="grid gap-2">
              {liquidacoes.map((l) => (
                <LiquidacaoCard key={l.id} liquidacao={l} />
              ))}
            </div>
          </div>
        )}

        {/* Lotes */}
        {lotes.length > 0 && (
          <div>
            <SectionHeader icon={Package} label="Lotes" count={lotes.length} />
            <div className="grid gap-2 sm:grid-cols-2">
              {lotes.map((l) => (
                <LoteCard key={l.id} lote={l} />
              ))}
            </div>
          </div>
        )}

        {contratos.length === 0 && empenhos.length === 0 && liquidacoes.length === 0 && lotes.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Nenhum vínculo encontrado para este processo.
          </p>
        )}
      </div>
    )}
  </div>
);

// ---- Main Component ----

interface EmendaDetailViewProps {
  emenda: EmendaInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmendaDetailView = ({ emenda, open, onOpenChange }: EmendaDetailViewProps) => {
  if (!emenda) return null;

  // Related empenhos
  const relatedEmpenhos = mockEmpenhos.filter((e) =>
    emenda.empenhoIds.includes(e.id)
  );

  // Related processos via empenhos
  const processoIds = [...new Set(relatedEmpenhos.map((e) => e.processoId).filter(Boolean))];
  const relatedProcessos = mockProcessos.filter((p) => processoIds.includes(p.id));

  // Build per-processo data
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

  // Total values
  const totalEmpenhos = relatedEmpenhos.reduce((s, e) => s + e.valor, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            Detalhes da Emenda — {emenda.codigo}
          </DialogTitle>
          <DialogDescription>
            Timeline de processos, contratos, empenhos e liquidações vinculados a esta emenda parlamentar.
          </DialogDescription>
        </DialogHeader>

        {/* Emenda summary card */}
        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Nº Emenda</p>
            <p className="font-semibold">{emenda.numeroEmenda}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Tipo</p>
            <Badge variant="secondary">{emenda.tipo}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Autor</p>
            <p className="font-medium">{emenda.autor}</p>
            <p className="text-xs text-muted-foreground">{emenda.cargoAutor}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Valor</p>
            <p className="font-semibold text-primary">{formatCurrency(emenda.valor)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground text-xs">Objeto</p>
            <p className="text-sm">{emenda.objeto || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Processos Vinculados</p>
            <p className="font-semibold">{relatedProcessos.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Total Empenhado</p>
            <p className="font-semibold text-primary">{formatCurrency(totalEmpenhos)}</p>
          </div>
        </div>

        {/* Timeline */}
        {relatedProcessos.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            Nenhum processo vinculado a esta emenda.
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Timeline de Processos
            </h3>
            <div className="relative">
              {relatedProcessos.map((proc, index) => {
                const data = getProcessoData(proc.id);
                const side = index % 2 === 0 ? "right" : "left";
                return (
                  <TimelineNode
                    key={proc.id}
                    processo={proc}
                    empenhos={data.empenhos}
                    contratos={data.contratos}
                    liquidacoes={data.liquidacoes}
                    lotes={data.lotes}
                    colorIndex={index}
                    isLast={index === relatedProcessos.length - 1}
                    side={side}
                  />
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmendaDetailView;
