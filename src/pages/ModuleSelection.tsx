import { useNavigate } from "react-router-dom";
import logoSAS from "@/assets/logo_SAS_color.png";
import {
  ScrollText,
  BarChart3,
  HeartPulse,
  Users,
  Building,
  Banknote,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  {
    title: "Gestão de Contratos",
    description: "Processos, contratos, empenhos, liquidações e lotes",
    icon: ScrollText,
    color: "bg-primary/10 text-primary",
    path: "/gestao-contratos",
  },
  {
    title: "Dashboard Diversos",
    description: "Painéis analíticos e indicadores gerenciais",
    icon: BarChart3,
    color: "bg-secondary/10 text-secondary",
    path: "/dashboards",
  },
  {
    title: "Dados de Saúde",
    description: "Indicadores epidemiológicos e gestão de unidades",
    icon: HeartPulse,
    color: "bg-destructive/10 text-destructive",
    path: "/saude",
  },
  {
    title: "Recursos Humanos",
    description: "Gestão de pessoal, folha e capacitação",
    icon: Users,
    color: "bg-info/10 text-info",
    path: "/rh",
  },
  {
    title: "Patrimônio",
    description: "Controle de bens móveis e imóveis",
    icon: Building,
    color: "bg-accent/10 text-accent-foreground",
    path: "/patrimonio",
  },
  {
    title: "Financeiro",
    description: "Orçamento, receitas, despesas e prestação de contas",
    icon: Banknote,
    color: "bg-success/10 text-success",
    path: "/financeiro",
  },
];

const ModuleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Building className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">PACTUS</h1>
              <p className="text-xs text-muted-foreground">Acompanhamento de Contratos</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => navigate("/")}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground">Módulos do Sistema</h2>
          <p className="mt-2 text-muted-foreground">
            Selecione o módulo que deseja acessar
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const isAvailable = mod.path === "/gestao-contratos";
            return (
              <button
                key={mod.path}
                onClick={() => isAvailable && navigate(mod.path)}
                className={`group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all duration-200 ${
                  isAvailable
                    ? "cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
                    : "cursor-default opacity-60"
                }`}
              >
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${mod.color} transition-transform duration-200 ${
                    isAvailable ? "group-hover:scale-110" : ""
                  }`}
                >
                  <mod.icon className="h-7 w-7" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{mod.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {mod.description}
                </p>
                {!isAvailable && (
                  <span className="mt-3 rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Em breve
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-3 mt-auto">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 — Administração Pública Municipal
          </p>
          <img src={logoSAS} alt="SAS - Superintendência de Análise de Sistema" className="h-10 object-contain" />
        </div>
      </footer>
    </div>
  );
};

export default ModuleSelection;
