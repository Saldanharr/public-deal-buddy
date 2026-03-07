import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ScrollText,
  Receipt,
  DollarSign,
  Wallet,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  Building2,
  Landmark,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/gestao-contratos" },
  { label: "Processos", icon: FileText, path: "/gestao-contratos/processos" },
  { label: "Contratos", icon: ScrollText, path: "/gestao-contratos/contratos" },
  { label: "Empenhos", icon: Receipt, path: "/gestao-contratos/empenhos" },
  { label: "Emendas", icon: Landmark, path: "/gestao-contratos/emendas" },
  { label: "Liquidações", icon: DollarSign, path: "/gestao-contratos/liquidacoes" },
  { label: "Saldo de Empenho", icon: Wallet, path: "/gestao-contratos/saldo-empenho" },
  { label: "Produtos/Serviços", icon: Package, path: "/gestao-contratos/produtos-servicos" },
  { label: "Lotes", icon: Layers, path: "/gestao-contratos/lotes" },
];

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`sidebar-gradient flex flex-col border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">
              GESTÃO DE
            </h1>
            <p className="text-xs text-sidebar-foreground -mt-0.5">Contratos Públicos</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        <p className={`text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted mb-3 ${collapsed ? "text-center" : "px-3"}`}>
          {collapsed ? "•••" : "Menu Principal"}
        </p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <Link
          to="/modulos"
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <Layers className="h-4 w-4" />
          ) : (
            <>
              <Layers className="h-4 w-4" />
              <span>Módulos</span>
            </>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
