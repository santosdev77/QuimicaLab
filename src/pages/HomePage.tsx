import { useNavigate } from "react-router";
import { useState } from "react";
import AtomVisualizer from "../components/AtomVisualizer";
import ElementCard from "../components/ElementCard";
import { elements } from "../data/elements";

const PREVIEW_ELEMENTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const previewEls = PREVIEW_ELEMENTS.map(n => elements.find(e => e.number === n)!);

const STATS = [
  { label: "XP", value: "2.450", icon: "⚡" },
  { label: "Nível", value: "12", icon: "🎯" },
  { label: "Sequência", value: "7 dias", icon: "🔥" },
  { label: "Questões", value: "148", icon: "📝" },
  { label: "Acertos", value: "89%", icon: "✅" },
];

const BADGES = [
  { name: "Mestre dos Elementos", icon: "🏆", earned: true },
  { name: "Conhecedor da Tabela", icon: "📊", earned: true },
  { name: "10 Desafios", icon: "⚔️", earned: true },
  { name: "Primeiro Experimento", icon: "🧪", earned: false },
  { name: "100 Questões", icon: "💯", earned: false },
];

const LEARN_CARDS = [
  {
    icon: "⚛️",
    title: "Estrutura Atômica",
    desc: "Entenda prótons, nêutrons e elétrons.",
    color: "from-blue-500 to-blue-700",
    to: "/aprender",
  },
  {
    icon: "🔄",
    title: "Distribuição Eletrônica",
    desc: "Descubra como os elétrons se distribuem.",
    color: "from-violet-500 to-violet-700",
    to: "/aprender",
  },
  {
    icon: "🔗",
    title: "Ligações Químicas",
    desc: "Aprenda como os átomos se conectam.",
    color: "from-teal-500 to-teal-700",
    to: "/aprender",
  },
  {
    icon: "📐",
    title: "Propriedades Periódicas",
    desc: "Entenda raio atômico, eletronegatividade e outras propriedades.",
    color: "from-orange-500 to-orange-700",
    to: "/aprender",
  },
];

const LAB_CARDS = [
  { icon: "⚛️", title: "Monte um Átomo", desc: "Adicione prótons, nêutrons e elétrons" },
  { icon: "⚡", title: "Forme um Íon", desc: "Explore cátions e ânions" },
  { icon: "🧬", title: "Monte uma Molécula", desc: "Una átomos em estruturas" },
];

const QUIZ_OPTIONS = ["Carbono", "Oxigênio", "Nitrogênio", "Flúor"];

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
  };

  return (
    <div className="bg-white">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.2,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-float-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                Plataforma educacional interativa
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
                Descubra a Química<br />
                <span className="text-blue-400">de um jeito diferente.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
                Explore os elementos, monte átomos, faça desafios e aprenda Química de forma interativa.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/tabela")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-900/50"
                >
                  Explorar Tabela Periódica
                </button>
                <button
                  onClick={() => navigate("/desafios")}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  Começar desafio
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <AtomVisualizer size={280} protons={8} animated />
                {/* Floating element tags */}
                {[
                  { symbol: "H", left: "5%", top: "10%" },
                  { symbol: "O", left: "80%", top: "15%" },
                  { symbol: "Na", left: "85%", top: "75%" },
                  { symbol: "Fe", left: "0%", top: "75%" },
                ].map(tag => (
                  <div
                    key={tag.symbol}
                    className="absolute px-2.5 py-1 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white text-xs font-mono font-bold"
                    style={{ left: tag.left, top: tag.top }}
                  >
                    {tag.symbol}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABELA PERIÓDICA PREVIEW ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Explore a Tabela Periódica</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            118 elementos organizados e interativos. Clique em qualquer elemento para ver detalhes completos.
          </p>
        </div>

        {/* Mini preview — periods 1 and 2 */}
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
            {previewEls.map(el => (
              <ElementCard key={el.number} element={el} size="md" />
            ))}
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 justify-center mt-6 mb-8">
          {["Metais", "Ametais", "Gases Nobres", "Halogênios", "Metais Alcalinos", "Metais de Transição"].map(f => (
            <button
              key={f}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/tabela")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            Ver Tabela Completa →
          </button>
        </div>
      </section>

      {/* ── APRENDA NA PRÁTICA ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Aprenda na Prática</h2>
            <p className="text-slate-500">Conteúdos estruturados para facilitar seu aprendizado</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEARN_CARDS.map(card => (
              <button
                key={card.title}
                onClick={() => navigate(card.to)}
                className="group text-left bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-transparent hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                <div className="p-6">
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                  <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700 flex items-center gap-1">
                    Acessar módulo <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LABORATÓRIO VIRTUAL ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-xs font-medium mb-5">
              🧪 Laboratório Virtual
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Experimente sem sair de casa
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Simule experimentos, monte estruturas atômicas e explore a Química de forma segura e interativa. Sem reagentes, sem riscos — puro aprendizado.
            </p>
            <div className="space-y-3">
              {LAB_CARDS.map(card => (
                <button
                  key={card.title}
                  onClick={() => navigate("/laboratorio")}
                  className="w-full flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl group-hover:bg-blue-100 transition-colors">
                    {card.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 text-sm">{card.title}</div>
                    <div className="text-slate-500 text-xs">{card.desc}</div>
                  </div>
                  <div className="ml-auto text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all">→</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-10 shadow-2xl">
              <AtomVisualizer size={200} protons={6} animated />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <div className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white text-xs font-mono">
                  Carbono · C · 12
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESAFIE SEUS CONHECIMENTOS ── */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Desafie seus Conhecimentos</h2>
              <p className="text-blue-200 mb-8">
                Responda questões, ganhe XP, suba de nível e conquiste badges exclusivos.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {STATS.map(s => (
                  <div key={s.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-xl font-bold">{s.value}</div>
                    <div className="text-blue-200 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/desafios")}
                className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Ir para Desafios →
              </button>
            </div>

            {/* Quiz card */}
            <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Tabela Periódica · Fácil
                </span>
                <span className="text-xs text-slate-400 font-mono">+20 XP</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-5">
                Qual elemento possui número atômico 8?
              </h3>
              <div className="space-y-2.5">
                {QUIZ_OPTIONS.map((opt, idx) => {
                  const isCorrect = idx === 1;
                  const isSelected = selectedAnswer === idx;
                  let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
                  if (selectedAnswer === null) {
                    cls += "border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 cursor-pointer";
                  } else if (isCorrect) {
                    cls += "border-green-400 bg-green-50 text-green-800";
                  } else if (isSelected) {
                    cls += "border-red-400 bg-red-50 text-red-800";
                  } else {
                    cls += "border-slate-200 text-slate-400 cursor-default";
                  }
                  return (
                    <button key={opt} className={cls} onClick={() => handleAnswer(idx)}>
                      <span className="font-mono font-bold mr-2 text-slate-400">
                        {["A", "B", "C", "D"][idx]})
                      </span>
                      {opt}
                      {selectedAnswer !== null && isCorrect && <span className="float-right">✓</span>}
                      {isSelected && !isCorrect && <span className="float-right">✗</span>}
                    </button>
                  );
                })}
              </div>
              {selectedAnswer !== null && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-800">
                  <strong>Explicação:</strong> O Oxigênio (O) tem número atômico 8, com 8 prótons no núcleo.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRESSO ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Acompanhe seu Progresso</h2>
          <p className="text-slate-500">Visualize sua evolução e mantenha o ritmo de estudos</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Progress card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm col-span-1 lg:col-span-2">
            <h3 className="font-bold text-slate-900 mb-5">Conteúdos</h3>
            {[
              { label: "Estrutura Atômica", pct: 85, color: "bg-blue-500" },
              { label: "Distribuição Eletrônica", pct: 60, color: "bg-violet-500" },
              { label: "Ligações Químicas", pct: 40, color: "bg-teal-500" },
              { label: "Propriedades Periódicas", pct: 20, color: "bg-orange-500" },
            ].map(item => (
              <div key={item.label} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-400 font-mono">{item.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%`, transition: "width 1s ease" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* XP card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6 shadow-sm">
            <div className="text-blue-200 text-sm font-medium mb-2">Nível Atual</div>
            <div className="text-5xl font-extrabold mb-1">12</div>
            <div className="text-blue-200 text-sm mb-6">Explorador Químico</div>
            <div className="text-xs text-blue-200 mb-2 flex justify-between">
              <span>XP: 2.450</span>
              <span>Próx: 3.000</span>
            </div>
            <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-300 rounded-full" style={{ width: "82%" }} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xl font-bold">7</div>
                <div className="text-xs text-blue-200">dias seguidos 🔥</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xl font-bold">89%</div>
                <div className="text-xs text-blue-200">taxa de acerto</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONQUISTAS ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Conquistas</h2>
            <p className="text-slate-500">Desbloqueie badges e mostre seu domínio da Química</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {BADGES.map(badge => (
              <div
                key={badge.name}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border w-36 text-center transition-all ${
                  badge.earned
                    ? "bg-white border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    : "bg-slate-100 border-slate-200 opacity-50 grayscale"
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                  badge.earned ? "bg-blue-50" : "bg-slate-200"
                }`}>
                  {badge.icon}
                </div>
                <div className="text-xs font-semibold text-slate-700 leading-tight">{badge.name}</div>
                {badge.earned && (
                  <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Conquistado
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/conquistas")}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Ver todas as conquistas →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
