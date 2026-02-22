import { Badge } from "@/components/ui/badge";

const contracts = [
  { id: "CT-2024-001", fornecedor: "Tech Solutions Ltda", objeto: "Manutenção de sistemas", valor: "R$ 450.000,00", vigencia: "12/2024", status: "Em Vigor" },
  { id: "CT-2024-002", fornecedor: "Construtora ABC S.A.", objeto: "Reforma predial", valor: "R$ 1.200.000,00", vigencia: "06/2025", status: "Em Vigor" },
  { id: "CT-2024-003", fornecedor: "Papelaria Central", objeto: "Material de escritório", valor: "R$ 85.000,00", vigencia: "03/2024", status: "Encerrado" },
  { id: "CT-2024-004", fornecedor: "Segurança Total ME", objeto: "Vigilância patrimonial", valor: "R$ 780.000,00", vigencia: "09/2025", status: "Aditivo" },
  { id: "CT-2024-005", fornecedor: "Clean Service Ltda", objeto: "Serviços de limpeza", valor: "R$ 320.000,00", vigencia: "11/2024", status: "Pendente" },
];

const statusVariant: Record<string, string> = {
  "Em Vigor": "bg-success/10 text-success border-success/20",
  "Encerrado": "bg-muted text-muted-foreground border-border",
  "Aditivo": "bg-warning/10 text-warning border-warning/20",
  "Pendente": "bg-info/10 text-info border-info/20",
};

const RecentContractsTable = () => {
  return (
    <div className="rounded-xl bg-card border border-border p-5 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Contratos Recentes</h3>
          <p className="text-xs text-muted-foreground">Últimos contratos cadastrados</p>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">Ver todos →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-semibold text-muted-foreground">Nº Contrato</th>
              <th className="pb-3 text-left text-xs font-semibold text-muted-foreground">Fornecedor</th>
              <th className="pb-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Objeto</th>
              <th className="pb-3 text-right text-xs font-semibold text-muted-foreground">Valor</th>
              <th className="pb-3 text-center text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors">
                <td className="py-3 font-medium text-card-foreground">{c.id}</td>
                <td className="py-3 text-card-foreground">{c.fornecedor}</td>
                <td className="py-3 text-muted-foreground hidden md:table-cell">{c.objeto}</td>
                <td className="py-3 text-right font-medium text-card-foreground">{c.valor}</td>
                <td className="py-3 text-center">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusVariant[c.status]}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentContractsTable;
