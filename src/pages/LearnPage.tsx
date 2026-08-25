import { useState } from "react";
import { useNavigate } from "react-router";

const MODULES = [
  {
    id: 1,
    icon: "⚛️",
    title: "Estrutura Atômica",
    desc: "Entenda a composição dos átomos e as partículas subatômicas.",
    color: "blue",
    duration: "25 min",
    xp: 150,
    progress: 85,
    topics: [
      { title: "O que é um átomo?", done: true },
      { title: "Prótons, nêutrons e elétrons", done: true },
      { title: "Modelos atômicos históricos", done: true },
      { title: "Número atômico e número de massa", done: true },
      { title: "Isótopos e ísobarios", done: false },
    ],
    content: `Um átomo é a menor unidade de matéria que mantém as propriedades de um elemento químico. É composto por um **núcleo** (contendo prótons e nêutrons) e uma **eletrosfera** (onde os elétrons circulam).

**Prótons (p⁺):** carga positiva, ficam no núcleo. O número de prótons define o elemento.

**Nêutrons (n⁰):** sem carga, ficam no núcleo. Determinam o isótopo.

**Elétrons (e⁻):** carga negativa, orbitam o núcleo. Determinam as propriedades químicas.

O **número atômico (Z)** = número de prótons.
A **massa atômica (A)** = prótons + nêutrons.`,
  },
  {
    id: 2,
    icon: "🔄",
    title: "Distribuição Eletrônica",
    desc: "Descubra como os elétrons se organizam nas camadas eletrônicas.",
    color: "violet",
    duration: "30 min",
    xp: 200,
    progress: 60,
    topics: [
      { title: "Camadas eletrônicas (K, L, M, N…)", done: true },
      { title: "Subníveis de energia (s, p, d, f)", done: true },
      { title: "Diagrama de Linus Pauling", done: true },
      { title: "Regra de Hund", done: false },
      { title: "Configuração de íons", done: false },
    ],
    content: `Os elétrons se distribuem em **camadas** ao redor do núcleo, cada uma com capacidade máxima:

- **K (n=1):** máximo de 2 elétrons
- **L (n=2):** máximo de 8 elétrons
- **M (n=3):** máximo de 18 elétrons
- **N (n=4):** máximo de 32 elétrons

Cada camada se divide em **subníveis**: s, p, d, f.

A distribuição segue o **Diagrama de Pauling**, preenchendo do menor para o maior nível de energia.`,
  },
  {
    id: 3,
    icon: "🔗",
    title: "Ligações Químicas",
    desc: "Aprenda como os átomos se unem para formar moléculas e compostos.",
    color: "teal",
    duration: "35 min",
    xp: 250,
    progress: 40,
    topics: [
      { title: "Por que átomos se ligam?", done: true },
      { title: "Ligação iônica", done: true },
      { title: "Ligação covalente", done: false },
      { title: "Ligação metálica", done: false },
      { title: "Forças intermoleculares", done: false },
    ],
    content: `Átomos se ligam para atingir maior estabilidade, geralmente completando a camada de valência (**octeto**).

**Ligação Iônica:** transferência de elétrons entre metal e ametal.
- Ex: NaCl (cloreto de sódio / sal de cozinha)

**Ligação Covalente:** compartilhamento de elétrons entre ametais.
- Simples (1 par), dupla (2 pares), tripla (3 pares)
- Ex: H₂O, CO₂, N₂

**Ligação Metálica:** elétrons livres compartilhados entre cátions metálicos.
- Responsável pela condutividade elétrica dos metais`,
  },
  {
    id: 4,
    icon: "📐",
    title: "Propriedades Periódicas",
    desc: "Entenda as tendências que variam ao longo da tabela periódica.",
    color: "orange",
    duration: "40 min",
    xp: 300,
    progress: 20,
    topics: [
      { title: "Raio atômico", done: true },
      { title: "Energia de ionização", done: false },
      { title: "Afinidade eletrônica", done: false },
      { title: "Eletronegatividade", done: false },
      { title: "Caráter metálico", done: false },
    ],
    content: `As propriedades periódicas variam de forma sistemática ao longo da tabela.

**Raio atômico:**
- Aumenta ↓ (de cima para baixo) — mais camadas
- Diminui → (da esquerda para a direita) — mais prótons atraem os elétrons

**Eletronegatividade (Pauling):**
- O flúor (F) é o mais eletronegativo: 3,98
- Aumenta → e ↑ na tabela

**Energia de ionização:**
- Energia para remover um elétron
- Aumenta → e ↑ na tabela`,
  },
];

const COLOR_MAP: Record<string, string> = {
  blue: "from-blue-500 to-blue-700",
  violet: "from-violet-500 to-violet-700",
  teal: "from-teal-500 to-teal-700",
  orange: "from-orange-500 to-orange-700",
};
const BG_MAP: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  violet: "bg-violet-50 border-violet-200 text-violet-700",
  teal: "bg-teal-50 border-teal-200 text-teal-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
};

export default function LearnPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<number | null>(null);

  const mod = active !== null ? MODULES.find(m => m.id === active) : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {mod ? (
          /* ── Module detail view ── */
          <div>
            <button
              onClick={() => setActive(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors"
            >
              ← Voltar aos módulos
            </button>

            <div className={`h-2 rounded-full bg-gradient-to-r ${COLOR_MAP[mod.color]} mb-6`} />
            <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{mod.title}</h1>
                <p className="text-slate-500">{mod.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${BG_MAP[mod.color]}`}>
                  ⚡ +{mod.xp} XP
                </span>
                <span className="text-sm text-slate-500">⏱ {mod.duration}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Topics */}
              <div>
                <h2 className="font-bold text-slate-900 mb-4 text-lg">Tópicos</h2>
                <div className="space-y-2">
                  {mod.topics.map((t, i) => (
                    <div
                      key={t.title}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        t.done
                          ? "bg-green-50 border-green-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        t.done ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        {t.done ? "✓" : i + 1}
                      </div>
                      <span className={`text-sm font-medium ${t.done ? "text-green-800" : "text-slate-600"}`}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1.5">Progresso do módulo</div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${COLOR_MAP[mod.color]}`}
                      style={{ width: `${mod.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-xs font-mono text-slate-500 mt-1">{mod.progress}%</div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2">
                <h2 className="font-bold text-slate-900 mb-4 text-lg">Conteúdo</h2>
                <div className="prose prose-slate prose-sm max-w-none">
                  {mod.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed mb-4">
                      {para.split(/\*\*(.*?)\*\*/).map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="text-slate-900 font-semibold">{part}</strong>
                        ) : (
                          part
                        ),
                      )}
                    </p>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => navigate("/desafios")}
                    className={`flex-1 py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${COLOR_MAP[mod.color]} hover:opacity-90 transition-opacity`}
                  >
                    Fazer quiz deste módulo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Module grid ── */
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Aprenda Química</h1>
            <p className="text-slate-500 mb-10">Módulos interativos para dominar os fundamentos da Química.</p>

            <div className="grid sm:grid-cols-2 gap-6">
              {MODULES.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => setActive(mod.id)}
                  className="text-left bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${COLOR_MAP[mod.color]}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{mod.icon}</div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-slate-400">{mod.duration}</div>
                        <div className={`text-xs font-semibold mt-1 ${BG_MAP[mod.color].split(" ")[2]}`}>
                          +{mod.xp} XP
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{mod.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-5">{mod.desc}</p>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">{mod.topics.filter(t => t.done).length}/{mod.topics.length} tópicos</span>
                        <span className="font-mono text-slate-400">{mod.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${COLOR_MAP[mod.color]}`}
                          style={{ width: `${mod.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 text-sm font-medium text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                      {mod.progress === 0 ? "Começar módulo" : mod.progress === 100 ? "Revisar" : "Continuar"} →
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Stats summary */}
            <div className="mt-10 grid sm:grid-cols-4 gap-4">
              {[
                { label: "Módulos disponíveis", value: "4" },
                { label: "Tópicos no total", value: "20" },
                { label: "XP possível", value: "900" },
                { label: "Tempo estimado", value: "~2h 10min" },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
