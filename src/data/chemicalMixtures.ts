export type Reagent = {
  id: string;
  name: string;
  formula: string;
  description: string;
  color: string;
};

export type MixtureResult = {
  title: string;
  color: string;
  colorName: string;
  ph: number | null;
  temperature: number;
  precipitate?: boolean;
  bubbles?: boolean;
  heat?: boolean;
  explanation: string;
  equation?: string;
};

export const mixtureReagents: Reagent[] = [
  { id: "water", name: "Agua", formula: "H2O", description: "Solvente transparente e aproximadamente neutro.", color: "#dbeafe" },
  { id: "hcl", name: "Acido cloridrico", formula: "HCl", description: "Solucao acida, transparente e de pH baixo.", color: "#f8fafc" },
  { id: "naoh", name: "Hidroxido de sodio", formula: "NaOH", description: "Solucao basica, transparente e de pH alto.", color: "#f8fafc" },
  { id: "phenolphthalein", name: "Fenolftaleina", formula: "Indicador", description: "Incolor em meio acido ou neutro; rosa em meio basico.", color: "#fce7f3" },
  { id: "bromothymol", name: "Azul de bromotimol", formula: "Indicador", description: "Amarelo em acido, verde no neutro e azul em base.", color: "#bfdbfe" },
  { id: "cuso4", name: "Sulfato de cobre", formula: "CuSO4", description: "Sal que forma uma solucao azul em agua.", color: "#38bdf8" },
  { id: "kmno4", name: "Permanganato de potassio", formula: "KMnO4", description: "Sal que produz uma solucao roxa intensa.", color: "#7e22ce" },
  { id: "iodine", name: "Iodo", formula: "I2", description: "Solucao marrom-alaranjada para observacao didatica.", color: "#b45309" },
  { id: "ethanol", name: "Etanol", formula: "C2H5OH", description: "Liquido organico incolor e miscivel em agua.", color: "#e0f2fe" },
];

const contains = (items: string[], ...required: string[]) => required.every((item) => items.includes(item));

export function getMixtureResult(added: string[]): MixtureResult {
  if (!added.length) return { title: "Recipiente vazio", color: "#dbeafe", colorName: "sem liquido", ph: null, temperature: 25, explanation: "Adicione reagentes para iniciar uma observacao didatica." };
  if (contains(added, "cuso4", "naoh")) return { title: "Formacao de precipitado", color: "#60a5fa", colorName: "azul com solido azul-claro", ph: 12, temperature: 26, precipitate: true, explanation: "Os ions cobre(II) reagem com ions hidroxido e formam hidroxido de cobre(II), pouco solavel. As particulas solidas se acumulam no fundo do bequer.", equation: "CuSO4 + 2NaOH -> Cu(OH)2 v + Na2SO4" };
  if (contains(added, "hcl", "naoh")) return { title: "Reacao de neutralizacao", color: "#e2e8f0", colorName: "transparente", ph: 7, temperature: 28, heat: true, explanation: "O acido e a base formam agua e sal. Em termos ionicos, H+ e OH- participam da formacao de agua; a elevacao de temperatura e uma simulacao didatica.", equation: "HCl + NaOH -> NaCl + H2O" };
  const acidic = added.includes("hcl");
  const basic = added.includes("naoh");
  const neutral = added.includes("water") && !acidic && !basic;
  if (added.includes("phenolphthalein") && basic) return { title: "Indicador em meio basico", color: "#ec4899", colorName: "rosa", ph: 12, temperature: 25, explanation: "A fenolftaleina sofre uma mudanca estrutural em meio basico e passa a apresentar coloracao rosa." };
  if (added.includes("phenolphthalein") && acidic) return { title: "Indicador em meio acido", color: "#f8fafc", colorName: "incolor", ph: 2, temperature: 25, explanation: "A fenolftaleina permanece incolor em meio acido." };
  if (added.includes("bromothymol")) {
    if (acidic) return { title: "Indicador em meio acido", color: "#facc15", colorName: "amarelo", ph: 2, temperature: 25, explanation: "O azul de bromotimol fica amarelo em meio acido." };
    if (basic) return { title: "Indicador em meio basico", color: "#2563eb", colorName: "azul", ph: 12, temperature: 25, explanation: "O azul de bromotimol fica azul em meio basico." };
    if (neutral) return { title: "Indicador proximo ao neutro", color: "#22c55e", colorName: "verde", ph: 7, temperature: 25, explanation: "Proximo ao pH neutro, o azul de bromotimol apresenta coloracao verde." };
  }
  if (contains(added, "kmno4", "water")) return { title: "Dispersao em agua", color: "#7e22ce", colorName: "roxo", ph: 7, temperature: 25, explanation: "O permanganato de potassio se dispersa na agua e produz uma solucao roxa intensa." };
  if (added.includes("cuso4")) return { title: "Solucao de sulfato de cobre", color: "#38bdf8", colorName: "azul", ph: 6, temperature: 25, explanation: "Ions cobre(II) hidratados sao responsaveis pela coloracao azul observada." };
  if (added.includes("kmno4")) return { title: "Permanganato de potassio", color: "#7e22ce", colorName: "roxo", ph: 7, temperature: 25, explanation: "O ion permanganato apresenta uma coloracao violeta caracteristica." };
  if (added.includes("iodine")) return { title: "Solucao de iodo", color: "#b45309", colorName: "marrom-alaranjado", ph: 7, temperature: 25, explanation: "O iodo e mostrado como uma solucao marrom-alaranjada nesta simulacao." };
  if (basic) return { title: "Meio basico", color: "#f8fafc", colorName: "transparente", ph: 12, temperature: 25, explanation: "O hidroxido de sodio torna o meio basico nesta simulacao." };
  if (acidic) return { title: "Meio acido", color: "#f8fafc", colorName: "transparente", ph: 2, temperature: 25, explanation: "O acido cloridrico torna o meio acido nesta simulacao." };
  return { title: "Mistura em observacao", color: "#dbeafe", colorName: "transparente", ph: 7, temperature: 25, explanation: "A mistura esta sendo observada. Adicione um reagente ou indicador para explorar novas transformacoes." };
}
