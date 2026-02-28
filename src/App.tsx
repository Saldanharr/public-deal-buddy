import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Processos from "./pages/Processos";
import Empenhos from "./pages/Empenhos";
import ProdutosServicos from "./pages/ProdutosServicos";
import Lotes from "./pages/Lotes";
import Contratos from "./pages/Contratos";
import Liquidacoes from "./pages/Liquidacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/processos" element={<Processos />} />
          <Route path="/empenhos" element={<Empenhos />} />
          <Route path="/produtos-servicos" element={<ProdutosServicos />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/liquidacoes" element={<Liquidacoes />} />
          <Route path="/lotes" element={<Lotes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
