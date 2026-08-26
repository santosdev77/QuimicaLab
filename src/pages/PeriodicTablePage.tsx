import { useState, useMemo } from "react";
import {
  elements,
  CATEGORIES,
  type ElementCategory,
} from "../data/elements";
import ElementCard from "../components/ElementCard";

// Elementos principais: períodos 1 a 7
const mainEls = elements.filter((e) => e.period <= 7);

// Lantanídeos e actinídeos
const lanthanides = elements.filter((e) => e.period === 8);
const actinides = elements.filter((e) => e.period === 9);

// Posições dos espaços reservados
const LANTHANIDE_PLACEHOLDER = {
  period: 6,
  group: 3,
};

const ACTINIDE_PLACEHOLDER = {
  period: 7,
  group: 3,
};

export default function PeriodicTablePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ElementCategory | null>(null);

  // Pesquisa dos elementos
  const matchedNums = useMemo(() => {
    if (!search.trim()) return null;

    const q = search.trim().toLowerCase();

    const matched = elements.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.symbol.toLowerCase().includes(q) ||
        String(e.number).includes(q),
    );

    return new Set(matched.map((e) => e.number));
  }, [search]);

  // Define quais elementos ficam apagados
  function isDimmed(el: {
    number: number;
    category: ElementCategory;
  }) {
    if (matchedNums && !matchedNums.has(el.number)) {
      return true;
    }

    if (activeCategory && el.category !== activeCategory) {
      return true;
    }

    return false;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Tabela Periódica Completa
          </h1>

          <p className="text-slate-500">
            118 elementos interativos. Clique em um elemento para ver seus
            detalhes completos.
          </p>
        </div>

        {/* Pesquisa + filtros */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">

          {/* Campo de pesquisa */}
          <div className="relative w-full lg:w-72">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 fill-none stroke-current stroke-2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>

            <input
              type="text"
              placeholder="Pesquise um elemento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-1.5">

            {/* Todos */}
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

            {/* Categorias */}
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === cat.id ? null : cat.id,
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cat-${cat.id} ${
                  activeCategory === cat.id
                    ? "opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={
                  activeCategory === cat.id
                    ? {
                        background: "var(--cat-bg)",
                        borderColor: "var(--cat-border)",
                        color: "var(--cat-text)",
                      }
                    : {
                        borderColor: "#e2e8f0",
                        color: "#475569",
                      }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`flex items-center gap-1.5 cat-${cat.id}`}
            >
              <div
                className="w-3 h-3 rounded-sm border"
                style={{
                  background: "var(--cat-bg)",
                  borderColor: "var(--cat-border)",
                }}
              />

              <span className="text-[10px] text-slate-600">
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tabela principal */}
        <div className="overflow-x-auto pb-4">

          <div
            className="relative"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(18, minmax(72px, 1fr))",
              gridTemplateRows: "repeat(7, auto)",
              gap: "4px",
              minWidth: "1364px",
            }}
          >

            {/* Elementos principais */}
            {mainEls.map((el) => {
              // Espaço dos lantanídeos
              const isLaPos =
                el.period === 6 && el.group === 3;

              // Espaço dos actinídeos
              const isAcPos =
                el.period === 7 && el.group === 3;

              if (isLaPos || isAcPos) {
                return null;
              }

              return (
                <div
                  key={el.number}
                  style={{
                    gridColumn: el.group,
                    gridRow: el.period,
                  }}
                >
                  <ElementCard
                    element={el}
                    size="sm"
                    dimmed={isDimmed(el)}
                  />
                </div>
              );
            })}

            {/* Espaço dos lantanídeos */}
            <div
              style={{
                gridColumn: LANTHANIDE_PLACEHOLDER.group,
                gridRow: LANTHANIDE_PLACEHOLDER.period,
              }}
              className="w-[4.5rem] h-[5.25rem] flex items-center justify-center rounded-xl border border-dashed border-cyan-300 bg-cyan-50"
            >
              <span className="text-[11px] font-bold text-cyan-600 text-center leading-tight">
                57–71
                <br />
                La–Lu
              </span>
            </div>

            {/* Espaço dos actinídeos */}
            <div
              style={{
                gridColumn: ACTINIDE_PLACEHOLDER.group,
                gridRow: ACTINIDE_PLACEHOLDER.period,
              }}
              className="w-[4.5rem] h-[5.25rem] flex items-center justify-center rounded-xl border border-dashed border-fuchsia-300 bg-fuchsia-50"
            >
              <span className="text-[11px] font-bold text-fuchsia-600 text-center leading-tight">
                89–103
                <br />
                Ac–Lr
              </span>
            </div>
          </div>

          {/* Lantanídeos */}
          <div
            className="mt-4 flex gap-0.5 items-center"
            style={{
              marginLeft: "calc(3 * 76px)",
            }}
          >
            <div className="text-[11px] font-mono text-slate-400 mr-1 w-[4.5rem] text-center">
              57–71
            </div>

            <div className="flex gap-1">
              {lanthanides.map((el) => (
                <ElementCard
                  key={el.number}
                  element={el}
                  size="sm"
                  dimmed={isDimmed(el)}
                />
              ))}
            </div>
          </div>

          {/* Actinídeos */}
          <div
            className="mt-1 flex gap-0.5 items-center"
            style={{
              marginLeft: "calc(3 * 76px)",
            }}
          >
            <div className="text-[11px] font-mono text-slate-400 mr-1 w-[4.5rem] text-center">
              89–103
            </div>

            <div className="flex gap-1">
              {actinides.map((el) => (
                <ElementCard
                  key={el.number}
                  element={el}
                  size="sm"
                  dimmed={isDimmed(el)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Categorias */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => {

            // Conta os elementos diretamente do arquivo original
            const count = elements.filter(
              (e) => e.category === cat.id,
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === cat.id ? null : cat.id,
                  )
                }
                className={`cat-${cat.id} flex items-center justify-between p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                  activeCategory === cat.id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                style={{
                  background: "var(--cat-bg)",
                  borderColor: "var(--cat-border)",
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: "var(--cat-text)",
                  }}
                >
                  {cat.label}
                </span>

                <span
                  className="text-xs font-mono ml-2"
                  style={{
                    color: "var(--cat-text)",
                    opacity: 0.7,
                  }}
                >
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
