import { useState } from "react";
import { useNavigate } from "react-router";
import AtomVisualizer from "../components/AtomVisualizer";
import { elements } from "../data/elements";

type LabMode = "home" | "atom" | "ion" | "molecule";

const COMMON_ELEMENTS = [1, 2, 6, 7, 8, 11, 12, 17, 20, 26];

const MOLECULES = [
  {
    name: "Água",
    formula: "H₂O",
    atoms: [
      { symbol: "O", color: "#ef4444" },
      { symbol: "H", color: "#94a3b8" },
      { symbol: "H", color: "#94a3b8" },
    ],
    desc: "Molécula polar com geometria angular e ligações covalentes polares.",
  },
  {
    name: "Dióxido de Carbono",
    formula: "CO₂",
    atoms: [
      { symbol: "O", color: "#ef4444" },
      { symbol: "C", color: "#1e293b" },
      { symbol: "O", color: "#ef4444" },
    ],
    desc: "Molécula linear com duas duplas ligações.",
  },
  {
    name: "Amônia",
    formula: "NH₃",
    atoms: [
      { symbol: "N", color: "#2563eb" },
      { symbol: "H", color: "#94a3b8" },
      { symbol: "H", color: "#94a3b8" },
      { symbol: "H", color: "#94a3b8" },
    ],
    desc: "Molécula piramidal com geometria trigonal.",
  },
  {
    name: "Metano",
    formula: "CH₄",
    atoms: [
      { symbol: "C", color: "#1e293b" },
      { symbol: "H", color: "#94a3b8" },
      { symbol: "H", color: "#94a3b8" },
      { symbol: "H", color: "#94a3b8" },
      { symbol: "H", color: "#94a3b8" },
    ],
    desc: "Molécula tetraédrica. Principal componente do gás natural.",
  },
  {
    name: "Cloreto de Sódio",
    formula: "NaCl",
    atoms: [
      { symbol: "Na", color: "#f59e0b" },
      { symbol: "Cl", color: "#10b981" },
    ],
    desc: "Composto iônico formado por Na⁺ e Cl⁻.",
  },
  {
    name: "Gás Oxigênio",
    formula: "O₂",
    atoms: [
      { symbol: "O", color: "#ef4444" },
      { symbol: "O", color: "#ef4444" },
    ],
    desc: "Molécula diatômica com ligação dupla. Essencial para a respiração.",
  },
];

export default function LabPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<LabMode>("home");

  const [selectedEl, setSelectedEl] = useState(8);

  const [protonCount, setProtonCount] = useState(8);
  const [neutronCount, setNeutronCount] = useState(8);
  const [electronCount, setElectronCount] = useState(8);

  const [ionCharge, setIonCharge] = useState(0);

  const [selectedMol, setSelectedMol] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);

  const [customFormula, setCustomFormula] = useState("");
  const [customAtoms, setCustomAtoms] = useState<
  { symbol: string; color: string }[]
>([]);
const [customError, setCustomError] = useState("");

  const currentEl = elements.find((e) => e.number === protonCount);

  function getAtomColor(symbol: string) {
  const colors: Record<string, string> = {
    H: "#94a3b8",
    C: "#1e293b",
    N: "#2563eb",
    O: "#ef4444",
    F: "#22c55e",
    Cl: "#10b981",
    Br: "#b45309",
    I: "#8b5cf6",
    S: "#eab308",
    P: "#f97316",
    Na: "#f59e0b",
    K: "#a855f7",
    Ca: "#64748b",
    Mg: "#84cc16",
    Fe: "#dc2626",
    Cu: "#b45309",
    Zn: "#71717a",
  };

  return colors[symbol] || "#64748b";
}

function parseFormula(formula: string) {
  const clean = formula.replace(/\s/g, "");

  if (!clean) {
    return {
      atoms: [],
      error: "Digite uma fórmula química.",
    };
  }

  const atoms: { symbol: string; color: string }[] = [];

  const regex = /([A-Z][a-z]?)(\d*)/g;

  let match;
  let position = 0;

  while ((match = regex.exec(clean)) !== null) {
    if (match.index !== position) {
      return {
        atoms: [],
        error: "Fórmula inválida. Use símbolos químicos, como H2O ou CO2.",
      };
    }

    const symbol = match[1];
    const quantity = match[2] ? Number(match[2]) : 1;

    if (quantity < 1 || quantity > 50) {
      return {
        atoms: [],
        error: "A quantidade de átomos deve estar entre 1 e 50.",
      };
    }

    const elementExists = elements.some(
      (element) => element.symbol === symbol
    );

    if (!elementExists) {
      return {
        atoms: [],
        error: `O elemento "${symbol}" não foi encontrado.`,
      };
    }

    for (let i = 0; i < quantity; i++) {
      atoms.push({
        symbol,
        color: getAtomColor(symbol),
      });
    }

    position = regex.lastIndex;
  }

  if (position !== clean.length || atoms.length === 0) {
    return {
      atoms: [],
      error: "Fórmula inválida.",
    };
  }

  return {
    atoms,
    error: "",
  };
}

function handleCustomMolecule() {
  const result = parseFormula(customFormula);

  if (result.error) {
    setCustomError(result.error);
    setCustomAtoms([]);
    return;
  }

  setCustomError("");
  setCustomAtoms(result.atoms);
}

  const charge = protonCount - electronCount;

  const massNumber = protonCount + neutronCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-xs font-semibold mb-4">
            🧪 Laboratório Virtual
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Laboratório Virtual
          </h1>

          <p className="text-slate-500 max-w-2xl">
            Experimente, monte e explore estruturas atômicas, íons e moléculas
            de forma interativa.
          </p>
        </div>

        {/* HOME */}
        {mode === "home" && (
          <div>
            <div className="grid md:grid-cols-3 gap-6">

              {/* ÁTOMO */}
              <button
                onClick={() => setMode("atom")}
                className="group text-left bg-white border border-blue-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-4xl mb-5 group-hover:scale-110 transition-transform">
                  ⚛️
                </div>

                <h3 className="font-bold text-xl text-slate-900 mb-3">
                  Monte um Átomo
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Adicione prótons, nêutrons e elétrons e visualize a estrutura
                  do átomo.
                </p>

                <span className="text-blue-600 font-semibold text-sm">
                  Experimentar →
                </span>
              </button>

              {/* ÍON */}
              <button
                onClick={() => setMode("ion")}
                className="group text-left bg-white border border-violet-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-4xl mb-5 group-hover:scale-110 transition-transform">
                  ⚡
                </div>

                <h3 className="font-bold text-xl text-slate-900 mb-3">
                  Forme um Íon
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Adicione ou remova elétrons e descubra como são formados
                  cátions e ânions.
                </p>

                <span className="text-violet-600 font-semibold text-sm">
                  Experimentar →
                </span>
              </button>

              {/* MOLÉCULA */}
              <button
                onClick={() => setMode("molecule")}
                className="group text-left bg-white border border-teal-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-4xl mb-5 group-hover:scale-110 transition-transform">
                  🧬
                </div>

                <h3 className="font-bold text-xl text-slate-900 mb-3">
                  Monte uma Molécula
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Explore moléculas conhecidas e suas estruturas químicas.
                </p>

                <span className="text-teal-600 font-semibold text-sm">
                  Experimentar →
                </span>
              </button>

            </div>

            {/* INFORMAÇÃO */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Explore a Química
                  </h3>

                  <p className="text-sm text-slate-600">
                    Utilize o laboratório para entender visualmente como
                    prótons, nêutrons e elétrons formam a matéria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÁTOMO */}
        {mode === "atom" && (
          <div>

            <button
              onClick={() => setMode("home")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium text-sm mb-6 transition-colors"
            >
              ← Voltar ao laboratório
            </button>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  Monte um Átomo
                </h2>

                <p className="text-slate-500 mt-1">
                  Ajuste as partículas e observe o resultado.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 text-xs font-semibold">
                  Simulação ativa
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">

              {/* CONTROLES */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

                <h3 className="font-bold text-lg text-slate-900 mb-6">
                  Partículas
                </h3>

                <div className="space-y-5">

                  {[
                    {
                      label: "Prótons",
                      symbol: "p⁺",
                      val: protonCount,
                      set: setProtonCount,
                      min: 1,
                      max: 118,
                      color: "blue",
                    },
                    {
                      label: "Nêutrons",
                      symbol: "n⁰",
                      val: neutronCount,
                      set: setNeutronCount,
                      min: 0,
                      max: 200,
                      color: "slate",
                    },
                    {
                      label: "Elétrons",
                      symbol: "e⁻",
                      val: electronCount,
                      set: setElectronCount,
                      min: 0,
                      max: 200,
                      color: "red",
                    },
                  ].map((ctrl) => (

                    <div
                      key={ctrl.label}
                      className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
                    >

                      <div className="flex justify-between items-center mb-4">

                        <div>
                          <span
                            className={`font-bold text-sm ${
                              ctrl.color === "blue"
                                ? "text-blue-600"
                                : ctrl.color === "red"
                                ? "text-red-500"
                                : "text-slate-600"
                            }`}
                          >
                            {ctrl.label} ({ctrl.symbol})
                          </span>
                        </div>

                        <span className="text-2xl font-mono font-extrabold text-slate-900">
                          {ctrl.val}
                        </span>

                      </div>

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() =>
                            ctrl.set(Math.max(ctrl.min, ctrl.val - 1))
                          }
                          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xl transition-colors"
                        >
                          −
                        </button>

                        <input
                          type="range"
                          min={ctrl.min}
                          max={ctrl.max}
                          value={ctrl.val}
                          onChange={(e) =>
                            ctrl.set(Number(e.target.value))
                          }
                          className="flex-1 accent-blue-600 cursor-pointer"
                        />

                        <button
                          onClick={() =>
                            ctrl.set(Math.min(ctrl.max, ctrl.val + 1))
                          }
                          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xl transition-colors"
                        >
                          +
                        </button>

                      </div>
                    </div>
                  ))}

                </div>

                {/* INFORMAÇÕES */}
                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <div className="text-xs text-blue-600 font-semibold">
                      Número atômico
                    </div>

                    <div className="text-2xl font-mono font-extrabold text-blue-900 mt-1">
                      {protonCount}
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                    <div className="text-xs text-indigo-600 font-semibold">
                      Número de massa
                    </div>

                    <div className="text-2xl font-mono font-extrabold text-indigo-900 mt-1">
                      {massNumber}
                    </div>
                  </div>

                </div>

                {/* ELEMENTO */}
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">

                  <div className="text-xs text-blue-600 font-semibold mb-1">
                    Elemento identificado
                  </div>

                  <div className="text-xl font-extrabold text-slate-900">
                    {currentEl
                      ? `${currentEl.name} (${currentEl.symbol})`
                      : "Elemento desconhecido"}
                  </div>

                  <div className="mt-2 text-sm text-slate-600 font-mono">
                    Z = {protonCount} · A = {massNumber}
                  </div>

                  {charge !== 0 && (
                    <div
                      className={`mt-3 inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        charge > 0
                          ? "bg-orange-100 text-orange-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      Íon {charge > 0 ? `${charge}+` : `${Math.abs(charge)}−`}
                    </div>
                  )}

                </div>

              </div>

              {/* VISUALIZAÇÃO */}
              <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 rounded-3xl p-8 shadow-2xl min-h-[520px] flex flex-col">

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <h3 className="text-white font-bold text-lg">
                      Visualização Atômica
                    </h3>

                    <p className="text-blue-200 text-xs mt-1">
                      Modelo esquemático interativo
                    </p>
                  </div>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isPlaying
                        ? "bg-blue-500 text-white hover:bg-blue-400"
                        : "bg-white/10 text-blue-200 border border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {isPlaying ? "⏸ Pausar" : "▶ Continuar"}
                  </button>

                </div>

                <div className="flex-1 flex items-center justify-center">

                  <div className="scale-125 sm:scale-150">
                    <AtomVisualizer
                      size={300}
                      protons={protonCount}
                      electrons={electronCount}
                      animated={isPlaying}
                    />
                  </div>

                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">

                  <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-blue-300 text-xs">
                      Prótons
                    </div>
                    <div className="text-white font-bold text-lg">
                      {protonCount}
                    </div>
                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-slate-300 text-xs">
                      Nêutrons
                    </div>
                    <div className="text-white font-bold text-lg">
                      {neutronCount}
                    </div>
                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-red-300 text-xs">
                      Elétrons
                    </div>
                    <div className="text-white font-bold text-lg">
                      {electronCount}
                    </div>
                  </div>

                </div>

                <p className="text-center text-blue-200/70 text-xs mt-4">
                  Representação esquemática. Os orbitais reais são
                  probabilísticos.
                </p>

              </div>

            </div>
          </div>
        )}

        {/* ÍON */}
        {mode === "ion" && (
          <div>

            <button
              onClick={() => setMode("home")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium text-sm mb-6"
            >
              ← Voltar ao laboratório
            </button>

            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Forme um Íon
            </h2>

            <p className="text-slate-500 mb-8">
              Escolha um elemento e altere sua quantidade de elétrons.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

                <label className="text-sm font-bold text-slate-700 block mb-4">
                  Elemento base
                </label>

                <div className="flex flex-wrap gap-2 mb-7">

                  {COMMON_ELEMENTS.map((n) => {

                    const e = elements.find((el) => el.number === n)!;

                    return (
                      <button
                        key={n}
                        onClick={() => {
                          setSelectedEl(n);
                          setIonCharge(0);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-mono font-bold border transition-all ${
                          selectedEl === n
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        {e.symbol}
                      </button>
                    );
                  })}

                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">

                  <label className="text-sm font-bold text-slate-700 block mb-4">
                    Carga iônica
                  </label>

                  <div className="flex items-center gap-4">

                    <button
                      onClick={() =>
                        setIonCharge(Math.max(-4, ionCharge - 1))
                      }
                      className="w-11 h-11 rounded-full bg-white border border-slate-200 font-bold text-xl"
                    >
                      −
                    </button>

                    <div className="flex-1 text-center font-mono font-extrabold text-3xl text-slate-900">
                      {ionCharge === 0
                        ? "Neutro"
                        : ionCharge > 0
                        ? `${ionCharge}+`
                        : `${Math.abs(ionCharge)}−`}
                    </div>

                    <button
                      onClick={() =>
                        setIonCharge(Math.min(4, ionCharge + 1))
                      }
                      className="w-11 h-11 rounded-full bg-white border border-slate-200 font-bold text-xl"
                    >
                      +
                    </button>

                  </div>

                </div>

                {(() => {

                  const el = elements.find(
                    (e) => e.number === selectedEl
                  )!;

                  const elec = el.number - ionCharge;

                  return (
                    <div
                      className={`mt-5 rounded-2xl p-6 border ${
                        ionCharge > 0
                          ? "bg-orange-50 border-orange-200"
                          : ionCharge < 0
                          ? "bg-purple-50 border-purple-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >

                      <div className="text-2xl font-extrabold text-slate-900 mb-3">
                        {el.symbol}
                        {ionCharge !== 0
                          ? ionCharge > 0
                            ? `${ionCharge}+`
                            : `${Math.abs(ionCharge)}−`
                          : ""}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          Prótons:{" "}
                          <strong className="font-mono">
                            {el.number}
                          </strong>
                        </div>

                        <div>
                          Elétrons:{" "}
                          <strong className="font-mono">
                            {elec}
                          </strong>
                        </div>

                        {ionCharge > 0 && (
                          <div className="text-orange-700 font-semibold">
                            Cátion — perdeu {ionCharge} elétron(s)
                          </div>
                        )}

                        {ionCharge < 0 && (
                          <div className="text-purple-700 font-semibold">
                            Ânion — ganhou {Math.abs(ionCharge)} elétron(s)
                          </div>
                        )}

                        {ionCharge === 0 && (
                          <div className="text-green-700 font-semibold">
                            Átomo neutro
                          </div>
                        )}
                      </div>

                    </div>
                  );

                })()}

              </div>

              <div className="bg-gradient-to-br from-slate-950 to-blue-950 rounded-3xl p-8 min-h-[500px] flex items-center justify-center">

                <div className="text-center">

                  <AtomVisualizer
                    size={300}
                    protons={selectedEl}
                    electrons={selectedEl - ionCharge}
                    animated={isPlaying}
                  />

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="mt-6 px-5 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20"
                  >
                    {isPlaying ? "⏸ Pausar animação" : "▶ Continuar animação"}
                  </button>

                  {ionCharge !== 0 && (
                    <div className="mt-5">

                      <span
                        className={`px-5 py-2 rounded-full text-sm font-bold ${
                          ionCharge > 0
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        }`}
                      >
                        {elements.find(
                          (e) => e.number === selectedEl
                        )?.symbol}
                        {ionCharge > 0
                          ? `${ionCharge}+`
                          : `${Math.abs(ionCharge)}−`}
                      </span>

                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}

        {/* MOLÉCULAS */}
        {mode === "molecule" && (
          <div>

            <button
              onClick={() => setMode("home")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium text-sm mb-6"
            >
              ← Voltar ao laboratório
            </button>

            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Moléculas Interativas
            </h2>

            <p className="text-slate-500 mb-8">
              Selecione uma molécula para explorar sua estrutura.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">

              <div className="space-y-3">

                {MOLECULES.map((mol, i) => (

                  <button
                    key={mol.name}
                    onClick={() => setSelectedMol(i)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${
                      selectedMol === i
                        ? "bg-blue-50 border-blue-300 shadow-sm"
                        : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm"
                    }`}
                  >

                    <div className="w-16 text-center font-mono font-extrabold text-slate-900">
                      {mol.formula}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900">
                        {mol.name}
                      </div>

                      <div className="text-xs text-slate-500 mt-1">
                        {mol.atoms.length} átomos
                      </div>
                    </div>

                    {selectedMol === i && (
                      <div className="ml-auto text-blue-600 font-bold text-xl">
                        ✓
                      </div>
                    )}

                  </button>

                ))}

              </div>

              <div>

                <div className="bg-gradient-to-br from-slate-950 to-blue-950 rounded-3xl p-10 min-h-[380px] flex flex-col justify-center">

                  <div className="flex items-center justify-center gap-3 flex-wrap">

                    {MOLECULES[selectedMol].atoms.map((atom, i) => (

                      <div
                        key={i}
                        className="flex items-center gap-3"
                      >

                        {i > 0 && (
                          <div className="w-10 h-1 bg-white/30 rounded-full" />
                        )}

                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-white text-lg shadow-xl"
                          style={{ background: atom.color }}
                        >
                          {atom.symbol}
                        </div>

                      </div>

                    ))}

                  </div>

                  <div className="text-center mt-8 text-white font-mono font-extrabold text-4xl">
                    {MOLECULES[selectedMol].formula}
                  </div>

                  <div className="text-center text-blue-200 mt-2">
                    {MOLECULES[selectedMol].name}
                  </div>

                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 mt-4">

                  <h3 className="font-bold text-teal-900 mb-2">
                    💡 Sobre esta molécula
                  </h3>

                  <p className="text-teal-800 text-sm leading-relaxed">
                    {MOLECULES[selectedMol].desc}
                  </p>

                </div>

              </div>

            </div>

            {/* MOLÉCULA PERSONALIZADA */}
            <div className="mt-10 bg-white border border-teal-200 rounded-3xl p-6 shadow-sm">
              <div className="mb-5">
                <h3 className="text-xl font-extrabold text-slate-900">
                  ✨ Crie sua própria molécula
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Digite uma fórmula química e veja uma representação visual dos seus átomos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={customFormula}
                  onChange={(e) => {
                    setCustomFormula(e.target.value);
                    setCustomError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomMolecule();
                    }
                  }}
                  placeholder="Ex.: H2O, CO2, H2SO4, C6H12O6"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-lg"
                />

                <button
                  onClick={handleCustomMolecule}
                  className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors"
                >
                  🔬 Visualizar
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Exemplos: H2O • CO2 • NH3 • CH4 • NaCl • O2 • H2SO4
              </div>

              {customError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  ⚠️ {customError}
                </div>
              )}

              {customAtoms.length > 0 && (
                <div className="mt-6 grid lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-slate-950 to-blue-950 rounded-3xl p-8 min-h-[320px] flex flex-col items-center justify-center">
                    <div className="text-blue-200 text-xs font-semibold mb-6">
                      VISUALIZAÇÃO DA SUA MOLÉCULA
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {customAtoms.map((atom, index) => (
                        <div
                          key={`${atom.symbol}-${index}`}
                          className="flex items-center gap-2"
                        >
                          {index > 0 && (
                            <div className="w-8 h-1 bg-white/30 rounded-full" />
                          )}

                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold shadow-xl"
                            style={{ background: atom.color }}
                          >
                            {atom.symbol}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 text-white font-mono font-extrabold text-3xl">
                      {customFormula}
                    </div>

                    <div className="mt-2 text-blue-200 text-sm">
                      {customAtoms.length} átomo{customAtoms.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                    <h4 className="font-bold text-lg text-slate-900 mb-4">
                      🧪 Composição
                    </h4>

                    <div className="space-y-2">
                      {Array.from(
                        new Set(customAtoms.map((atom) => atom.symbol))
                      ).map((symbol) => {
                        const quantity = customAtoms.filter(
                          (atom) => atom.symbol === symbol
                        ).length;

                        const element = elements.find(
                          (el) => el.symbol === symbol
                        );

                        return (
                          <div
                            key={symbol}
                            className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: getAtomColor(symbol) }}
                              >
                                {symbol}
                              </div>

                              <div>
                                <div className="font-bold text-slate-900">
                                  {element?.name || symbol}
                                </div>

                                <div className="text-xs text-slate-500">
                                  Número atômico: {element?.number ?? "—"}
                                </div>
                              </div>
                            </div>

                            <div className="font-mono font-bold text-slate-900">
                              × {quantity}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
