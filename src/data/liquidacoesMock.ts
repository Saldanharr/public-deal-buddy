// Shared mock data for liquidações.
// Until backed by a real API, this is the single source of truth used by
// both the Liquidações page and any view that needs to compute the real
// execution (liquidado - estornos) of an empenho.

export interface LoteQuantidade {
  loteId: string;
  quantidade: number;
}

export interface Liquidacao {
  id: string;
  numero: string;
  empenhoIds: string[];
  lotesQuantidades: LoteQuantidade[];
  descricao: string;
  valorTotal: number;
  dataLiquidacao: string;
  /** Marca a liquidação como estorno (refund) — subtrai do total liquidado. */
  estorno?: boolean;
}

export const initialLiquidacoes: Liquidacao[] = [
  {
    id: "1",
    numero: "LIQ-2024-001",
    empenhoIds: ["1", "2"],
    lotesQuantidades: [
      { loteId: "1", quantidade: 10.0 },
      { loteId: "2", quantidade: 5.5 },
    ],
    descricao:
      "Liquidação referente à entrega parcial de materiais e equipamentos",
    valorTotal: 55000.0,
    dataLiquidacao: "2024-07-15",
  },
];

/**
 * Computes, for each empenho id, the real liquidated amount based on the
 * provided liquidações. Liquidação valor is allocated across its empenhos
 * proportionally to each empenho's empenhado value. Estornos subtract.
 */
export function computeLiquidadoPorEmpenho(
  liquidacoes: Liquidacao[],
  empenhos: { id: string; valor: number }[]
): Record<string, number> {
  const valorById: Record<string, number> = {};
  empenhos.forEach((e) => (valorById[e.id] = e.valor));

  const result: Record<string, number> = {};
  empenhos.forEach((e) => (result[e.id] = 0));

  for (const liq of liquidacoes) {
    const ids = liq.empenhoIds.filter((id) => valorById[id] != null);
    if (ids.length === 0) continue;
    const totalEmp = ids.reduce((s, id) => s + (valorById[id] || 0), 0);
    if (totalEmp <= 0) continue;
    const sign = liq.estorno ? -1 : 1;
    for (const id of ids) {
      const share = (valorById[id] || 0) / totalEmp;
      result[id] += sign * liq.valorTotal * share;
    }
  }
  // Clamp negatives to 0 (estornos cannot push below zero liquidado).
  for (const id of Object.keys(result)) {
    if (result[id] < 0) result[id] = 0;
  }
  return result;
}
