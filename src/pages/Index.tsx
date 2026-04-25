import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { EmpenhoChart, ContratosChart, ProdutosServicosResumo } from "@/components/DashboardCharts";
import RecentContractsTable from "@/components/RecentContractsTable";
import { FileText, ScrollText, Receipt, DollarSign, Wallet, Package, Search, Bell } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral da gestão de contratos públicos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-40"
            />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted transition-colors">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard title="Processos" value={127} icon={FileText} trend={{ value: "+12%", positive: true }} />
        <StatsCard title="Contratos" value={80} icon={ScrollText} subtitle="42 em vigor" variant="primary" />
        <StatsCard title="Empenhos" value={215} icon={Receipt} trend={{ value: "+8%", positive: true }} />
        <StatsCard title="Liquidações" value={189} icon={DollarSign} subtitle="87.9% do total" />
        <StatsCard title="Saldo Empenho" value="R$ 2.4M" icon={Wallet} variant="secondary" />
        <StatsCard title="Produtos/Serv." value={342} icon={Package} trend={{ value: "+5%", positive: true }} />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EmpenhoChart />
        <ContratosChart />
      </div>

      {/* Product/Service Summary */}
      <div className="mb-6">
        <ProdutosServicosResumo />
      </div>

      {/* Table */}
      <RecentContractsTable />
    </DashboardLayout>
  );
};

export default Index;
