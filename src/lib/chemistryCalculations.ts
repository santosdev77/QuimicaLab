import { elements } from "../data/elements";

export const AVOGADRO = 6.022e23;
export const format = (n: number, d = 3) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: d }).format(n);
export const num = (value: string, name: string) => {
  const n = Number(value.replace(",", "."));
  if (!Number.isFinite(n)) throw new Error(`Informe um valor válido para ${name}.`);
  return n;
};

export function molarMass(formula: string) {
  const text = formula.replace(/\s/g, "");
  if (!text) throw new Error("Informe uma fórmula química.");
  let i = 0;
  const number = () => { const match = text.slice(i).match(/^\d+/); if (!match) return 1; i += match[0].length; return Number(match[0]); };
  const group = (nested = false): Map<string, number> => {
    const counts = new Map<string, number>();
    while (i < text.length && text[i] !== ")") {
      if (text[i] === "(") { i++; const child = group(true); const factor = number(); child.forEach((n, s) => counts.set(s, (counts.get(s) ?? 0) + n * factor)); continue; }
      const match = text.slice(i).match(/^[A-Z][a-z]?/);
      if (!match) throw new Error(`Fórmula inválida perto de “${text.slice(i)}”.`);
      i += match[0].length;
      if (!elements.some((e) => e.symbol === match[0])) throw new Error(`Elemento ${match[0]} não encontrado na tabela.`);
      counts.set(match[0], (counts.get(match[0]) ?? 0) + number());
    }
    if (nested) { if (text[i] !== ")") throw new Error("Feche todos os parênteses da fórmula."); i++; }
    return counts;
  };
  const counts = group();
  if (i !== text.length) throw new Error("A fórmula contém caracteres não reconhecidos.");
  const parts = [...counts].map(([symbol, count]) => { const mass = elements.find((e) => e.symbol === symbol)!.mass; return { symbol, count, mass, total: count * mass }; });
  return { parts, total: parts.reduce((sum, p) => sum + p.total, 0) };
}
