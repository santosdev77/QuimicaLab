import { useState } from "react";
import { useNavigate } from "react-router";
import AtomVisualizer from "../components/AtomVisualizer";
import { elements } from "../data/elements";

type LabMode = "home" | "atom" | "ion" | "molecule";

const COMMON_ELEMENTS = [1, 2, 6, 7, 8, 11, 12, 17, 20, 26];

const MOLECULES = [
  { name: "Água", formula: "H₂O", atoms: [{ symbol: "O", color: "#ef4444" }, { symbol: "H", color: "#94a3b8" }, { symbol: "H", color: "#94a3b8" }], desc: "Molécula polar com geometria angular e ligações covalentes polares." },
  { name: "Dióxido de Carbono", formula: "CO₂", atoms: [{ symbol: "O", color: "#ef4444" }, { symbol: "C", color: "#1e293b" }, { symbol: "O", color: "#ef4444" }], desc: "Molécula linear com 2 duplas ligações. Principal gás do efeito estufa." },
  { name: "Amônia", formula: "NH₃", atoms: [{ symbol: "N", color: "#2563eb" }, { symbol: "H", color: "#94a3b8" }, { symbol: "H", color: "#94a3b8" }, { symbol: "H", color: "#94a3b8" }], desc: "Molécula piramidal com geometria trigonal. Base nitrogenada." },
  { name: "Metano", formula: "CH₄", atoms: [{ symbol: "C", color: "#1e293b" }, { symbol: "H", color: "#94a3b8" }, { symbol: "H", color: "#94a3b8" }, { symbol: "H", color: "#94a3b8" }, { symbol: "H", color: "#94a3b8" }], desc: "Molécula tetraédrica. Principal componente do gás natural." },
  { name: "Cloreto de Sódio", formula: "NaCl", atoms: [{ symbol: "Na", color: "#f59e0b" }, { symbol: "Cl", color: "#10b981" }], desc: "Composto iônico (sal de cozinha). Formado por íons Na⁺ e Cl⁻." },
  { name: "Gás Oxigênio", formula: "O₂", atoms: [{ symbol: "O", color: "#ef4444" }, { symbol: "O", color: "#ef4444" }], desc: "Molécula diatômica com ligação dupla. Essencial para a respiração." },
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

  const currentEl = elements.find(e => e.number === protonCount);
  const charge = protonCount - electronCount;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-xs font-medium mb-4">
            🧪 Laboratório Virtual
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Laboratório Virtual</h1>
          <p className="text-slate-500">Experimente, monte e explore estruturas atômicas de forma interativa.</p>
        </div>

        {mode === "home" && (
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "⚛️",
                title: "Monte um Átomo",
                desc: "Adicione prótons, nêutrons e elétrons e visualize o átomo em 3D.",
                mode: "atom" as LabMode,
                color: "blue",
              },
              {
                icon: "⚡",
                title: "Forme um Íon",
                desc: "Remova ou adicione elétrons para criar cátions e ânions.",
                mode: "ion" as LabMode,
                color: "violet",
              },
              {
                icon: "🧬",
                title: "Monte uma Molécula",
                desc: "Explore moléculas conhecidas e suas estruturas geométricas.",
                mode: "molecule" as LabMode,
                color: "teal",
              },
            ].map(card => (
              <button
                key={card.title}
                onClick={() => setMode(card.mode)}
                className="text-left bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{card.desc}</p>
                <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700 flex items-center gap-1">
                  Iniciar <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {mode === "atom" && (
          <div>
            <button onClick={() => setMode("home")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6">
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Monte um Átomo</h2>
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* Controls */}
              <div className="space-y-6">
                {[
                  { label: "Prótons (p⁺)", val: protonCount, set: setProtonCount, min: 1, max: 118, color: "text-blue-600" },
                  { label: "Nêutrons (n⁰)", val: neutronCount, set: setNeutronCount, min: 0, max: 200, color: "text-slate-600" },
                  { label: "Elétrons (e⁻)", val: electronCount, set: setElectronCount, min: 0, max: 200, color: "text-red-500" },
                ].map(ctrl => (
                  <div key={ctrl.label} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-semibold text-sm ${ctrl.color}`}>{ctrl.label}</span>
                      <span className="font-mono font-bold text-lg text-slate-900">{ctrl.val}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => ctrl.set(Math.max(ctrl.min, ctrl.val - 1))}
                        className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-lg flex items-center justify-center transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="range"
                        min={ctrl.min}
                        max={ctrl.max}
                        value={ctrl.val}
                        onChange={e => ctrl.set(Number(e.target.value))}
                        className="flex-1 accent-blue-500"
                      />
                      <button
                        onClick={() => ctrl.set(Math.min(ctrl.max, ctrl.val + 1))}
                        className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-lg flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {/* Info card */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <div className="font-bold text-blue-900 text-lg mb-1">
                    {currentEl ? `${currentEl.name} (${currentEl.symbol})` : "Elemento desconhecido"}
                  </div>
                  <div className="text-sm text-blue-700 font-mono">
                    Z = {protonCount} · A = {protonCount + neutronCount}
                  </div>
                  {charge !== 0 && (
                    <div className={`mt-1 text-sm font-semibold ${charge > 0 ? "text-orange-600" : "text-purple-600"}`}>
                      Íon {charge > 0 ? `${charge}+` : `${Math.abs(charge)}−`}
                    </div>
                  )}
                </div>
              </div>

              {/* Atom visualization */}
              <div className="flex flex-col items-center gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 shadow-xl">
                  <AtomVisualizer size={220} protons={protonCount} animated />
                </div>
                <div className="text-center text-slate-500 text-xs max-w-xs">
                  Visualização esquemática. Os orbitais reais são probabilísticos e não circulares.
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "ion" && (
          <div>
            <button onClick={() => setMode("home")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6">
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Forme um Íon</h2>
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Selecione o elemento base</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_ELEMENTS.map(n => {
                      const e = elements.find(el => el.number === n)!;
                      return (
                        <button
                          key={n}
                          onClick={() => { setSelectedEl(n); setIonCharge(0); }}
                          className={`px-3 py-1.5 rounded-xl text-sm font-mono font-bold border transition-all ${
                            selectedEl === n
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                          }`}
                        >
                          {e.symbol}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-4">
                  <label className="text-sm font-semibold text-slate-700 block mb-3">Carga iônica</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIonCharge(Math.max(-4, ionCharge - 1))}
                      className="w-9 h-9 rounded-full bg-white border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center font-mono font-bold text-2xl text-slate-900">
                      {ionCharge === 0 ? "Neutro" : ionCharge > 0 ? `${ionCharge}+` : `${Math.abs(ionCharge)}−`}
                    </div>
                    <button
                      onClick={() => setIonCharge(Math.min(4, ionCharge + 1))}
                      className="w-9 h-9 rounded-full bg-white border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {(() => {
                  const el = elements.find(e => e.number === selectedEl)!;
                  const elec = el.number - ionCharge;
                  return (
                    <div className={`rounded-2xl p-5 border ${ionCharge > 0 ? "bg-orange-50 border-orange-200" : ionCharge < 0 ? "bg-purple-50 border-purple-200" : "bg-green-50 border-green-200"}`}>
                      <div className="font-bold text-lg text-slate-900 mb-2">
                        {el.symbol}{ionCharge !== 0 ? (ionCharge > 0 ? `${ionCharge}+` : `${Math.abs(ionCharge)}−`) : ""}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="text-slate-600">Prótons: <strong className="font-mono">{el.number}</strong></div>
                        <div className="text-slate-600">Elétrons: <strong className="font-mono">{elec}</strong></div>
                        {ionCharge > 0 && <div className="text-orange-700 font-medium">Cátion — perdeu {ionCharge} elétron(s)</div>}
                        {ionCharge < 0 && <div className="text-purple-700 font-medium">Ânion — ganhou {Math.abs(ionCharge)} elétron(s)</div>}
                        {ionCharge === 0 && <div className="text-green-700 font-medium">Átomo neutro</div>}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8">
                  <AtomVisualizer size={200} protons={selectedEl} animated />
                  {ionCharge !== 0 && (
                    <div className="mt-4 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        ionCharge > 0 ? "bg-orange-500/20 text-orange-300 border border-orange-500/40" : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                      }`}>
                        {elements.find(e => e.number === selectedEl)?.symbol}
                        {ionCharge > 0 ? `${ionCharge}+` : `${Math.abs(ionCharge)}−`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "molecule" && (
          <div>
            <button onClick={() => setMode("home")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6">
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Moléculas Interativas</h2>
            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <div className="space-y-2 mb-6">
                  {MOLECULES.map((mol, i) => (
                    <button
                      key={mol.name}
                      onClick={() => setSelectedMol(i)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        selectedMol === i
                          ? "bg-blue-50 border-blue-300"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-mono font-bold text-slate-900 w-16 text-sm">{mol.formula}</div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{mol.name}</div>
                        <div className="text-xs text-slate-500">{mol.atoms.length} átomos</div>
                      </div>
                      {selectedMol === i && <div className="ml-auto text-blue-600">✓</div>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {/* Molecule visualizer */}
                <div className="bg-slate-900 rounded-2xl p-8 mb-4">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {MOLECULES[selectedMol].atoms.map((atom, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {i > 0 && <div className="w-8 h-0.5 bg-white/30" />}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg"
                          style={{ background: atom.color }}
                        >
                          {atom.symbol}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-6 text-white font-mono font-bold text-2xl">
                    {MOLECULES[selectedMol].formula}
                  </div>
                  <div className="text-center text-slate-400 text-sm mt-1">
                    {MOLECULES[selectedMol].name}
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
                  <h3 className="font-semibold text-teal-900 mb-1 text-sm">Sobre esta molécula</h3>
                  <p className="text-teal-800 text-sm leading-relaxed">{MOLECULES[selectedMol].desc}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
