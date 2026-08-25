import { useState, useMemo, useEffect } from "react";
import { elements, CATEGORIES, CATEGORY_LABELS, type ElementCategory } from "../data/elements";
import ElementCard from "../components/ElementCard";
import { getElements } from "../lib/supabase";


// Placeholder positions in main grid for lanthanide/actinide rows
const LANTHANIDE_PLACEHOLDER = { period: 6, group: 3 };
const ACTINIDE_PLACEHOLDER   = { period: 7, group: 3 };

export default function PeriodicTablePage() {

const [elementsFromDb, setElementsFromDb] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadElements() {
    try {
     const data = await getElements();

const formattedElements = data.map((el) => ({
  number: el.atomic_number,
  symbol: el.symbol,
  name: el.name,
  mass: el.atomic_mass,
  group: el.group_number,
  period: el.period,
  category: el.category,
  state: el.state,
}));

setElementsFromDb(formattedElements);

    } catch (error) {
      console.error("Erro ao carregar elementos:", error);
    } finally {
      setLoading(false);
    }
  }

  loadElements();
}, []);
const currentElements = elementsFromDb.length > 0
  ? elementsFromDb
  : elements;

const mainEls = currentElements.filter(e => e.period <= 7);
const lanthanides = currentElements.filter(e => e.period === 8);
const actinides = currentElements.filter(e => e.period === 9);


  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ElementCategory | null>(null);

  const matchedNums = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.trim().toLowerCase();
    const matched = currentElements.filter(
      e =>
        e.name.toLowerCase().includes(q) ||
        e.symbol.toLowerCase().includes(q) ||
        String(e.number).includes(q),
    );
    return new Set(matched.map(e => e.number));
  }, [search]);

  function isDimmed(el: { number: number; category: ElementCategory }) {
    if (matchedNums && !matchedNums.has(el.number)) return true;
    if (activeCategory && el.category !== activeCategory) return true;
    return false;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tabela Periódica Completa</h1>
          <p className="text-slate-500">
            118 elementos interativos. Clique em um elemento para ver seus detalhes completos.
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative w-full lg:w-72">
            <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 fill-none stroke-current stroke-2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Pesquise um elemento..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeCategory === null
                  ? "bg-slate-900 text-white border-slate-900"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cat-${cat.id} ${
                  activeCategory === cat.id
                    ? "opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={
                  activeCategory === cat.id
                    ? { background: "var(--cat-bg)", borderColor: "var(--cat-border)", color: "var(--cat-text)" }
                    : { borderColor: "#e2e8f0", color: "#475569" }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className={`flex items-center gap-1.5 cat-${cat.id}`}>
              <div className="w-3 h-3 rounded-sm border" style={{ background: "var(--cat-bg)", borderColor: "var(--cat-border)" }} />
              <span className="text-[10px] text-slate-600">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Main table */}
        <div className="overflow-x-auto pb-4">
          <div
            className="relative"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(18, minmax(52px, 1fr))",
              gridTemplateRows: "repeat(7, auto)",
              gap: "2px",
              minWidth: "980px",
            }}
          >
            {/* Period labels */}
            {[1,2,3,4,5,6,7].map(p => (
              <div
                key={`period-${p}`}
                className="flex items-center justify-center text-[10px] font-mono text-slate-400"
                style={{ gridColumn: 1, gridRow: p }}
              />
            ))}

            {/* Group labels */}
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(g => (
              <div
                key={`group-${g}`}
                className="text-center text-[9px] font-mono text-slate-300 pb-1"
                style={{ gridColumn: g, gridRow: 0 }}
              />
            ))}

            {/* Main elements */}
            {mainEls.map(el => {
              // Skip group-3 for periods 6 and 7 (lanthanide/actinide placeholder positions)
              const isLaPos = el.period === 6 && el.group === 3;
              const isAcPos = el.period === 7 && el.group === 3;
              if (isLaPos || isAcPos) return null;
              return (
                <div
                  key={el.number}
                  style={{ gridColumn: el.group, gridRow: el.period }}
                >
                  <ElementCard element={el} size="sm" dimmed={isDimmed(el)} />
                </div>
              );
            })}

            {/* Lanthanide placeholder */}
            <div
              style={{ gridColumn: LANTHANIDE_PLACEHOLDER.group, gridRow: LANTHANIDE_PLACEHOLDER.period }}
              className="w-12 h-14 flex items-center justify-center rounded-lg border border-dashed border-cyan-300 bg-cyan-50"
            >
              <span className="text-[8px] font-bold text-cyan-600 text-center leading-tight">57–71<br/>La–Lu</span>
            </div>

            {/* Actinide placeholder */}
            <div
              style={{ gridColumn: ACTINIDE_PLACEHOLDER.group, gridRow: ACTINIDE_PLACEHOLDER.period }}
              className="w-12 h-14 flex items-center justify-center rounded-lg border border-dashed border-fuchsia-300 bg-fuchsia-50"
            >
              <span className="text-[8px] font-bold text-fuchsia-600 text-center leading-tight">89–103<br/>Ac–Lr</span>
            </div>
          </div>

          {/* Lanthanides row */}
          <div className="mt-4 ml-[calc(3*54px)] flex gap-0.5 items-center" style={{ marginLeft: "calc(3 * 54px)" }}>
            <div className="text-[9px] font-mono text-slate-400 mr-1 w-12 text-center">57–71</div>
            <div className="flex gap-0.5">
              {lanthanides.map(el => (
                <ElementCard key={el.number} element={el} size="sm" dimmed={isDimmed(el)} />
              ))}
            </div>
          </div>

          {/* Actinides row */}
          <div className="mt-1 flex gap-0.5 items-center" style={{ marginLeft: "calc(3 * 54px)" }}>
            <div className="text-[9px] font-mono text-slate-400 mr-1 w-12 text-center">89–103</div>
            <div className="flex gap-0.5">
              {actinides.map(el => (
                <ElementCard key={el.number} element={el} size="sm" dimmed={isDimmed(el)} />
              ))}
            </div>
          </div>
        </div>

        {/* Category legend expanded */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => {
            const count = currentElements.filter(e => e.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`cat-${cat.id} flex items-center justify-between p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                  activeCategory === cat.id ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ background: "var(--cat-bg)", borderColor: "var(--cat-border)" }}
              >
                <span className="text-xs font-semibold" style={{ color: "var(--cat-text)" }}>
                  {cat.label}
                </span>
                <span className="text-xs font-mono ml-2" style={{ color: "var(--cat-text)", opacity: 0.7 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
