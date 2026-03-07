import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ModuleSelection from "./pages/ModuleSelection";
import Index from "./pages/Index";
import Processos from "./pages/Processos";
import Empenhos from "./pages/Empenhos";
import EmendasParlamentares from "./pages/EmendasParlamentares";
import ProdutosServicos from "./pages/ProdutosServicos";
import Lotes from "./pages/Lotes";
import Contratos from "./pages/Contratos";
import Liquidacoes from "./pages/Liquidacoes";
import SaldoEmpenho from "./pages/SaldoEmpenho";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth & Module Selection */}
          <Route path="/" element={<Login />} />
          <Route path="/modulos" element={<ModuleSelection />} />

          {/* Gestão de Contratos module */}
          <Route path="/gestao-contratos" element={<Index />} />
          <Route path="/gestao-contratos/processos" element={<Processos />} />
          <Route path="/gestao-contratos/empenhos" element={<Empenhos />} />
          <Route path="/gestao-contratos/emendas" element={<EmendasParlamentares />} />
          <Route path="/gestao-contratos/produtos-servicos" element={<ProdutosServicos />} />
          <Route path="/gestao-contratos/contratos" element={<Contratos />} />
          <Route path="/gestao-contratos/liquidacoes" element={<Liquidacoes />} />
          <Route path="/gestao-contratos/saldo-empenho" element={<SaldoEmpenho />} />
          <Route path="/gestao-contratos/lotes" element={<Lotes />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
