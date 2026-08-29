import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useProgress } from "../progress/ProgressContext";

const MODULES = [
  {
    id: 1,
    icon: "⚛️",
    title: "Estrutura Atômica",
    desc: "Entenda a composição dos átomos e as partículas subatômicas.",
    color: "blue",
    duration: "25 min",
    xp: 150,
    topics: [
      { title: "O que é um átomo?" },
      { title: "Prótons, nêutrons e elétrons" },
      { title: "Modelos atômicos históricos" },
      { title: "Número atômico e número de massa" },
      { title: "Isótopos e ísobarios" },
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
    topics: [
      { title: "Camadas eletrônicas (K, L, M, N…)" },
      { title: "Subníveis de energia (s, p, d, f)" },
      { title: "Diagrama de Linus Pauling" },
      { title: "Regra de Hund" },
      { title: "Configuração de íons" },
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
    topics: [
      { title: "Por que átomos se ligam?" },
      { title: "Ligação iônica" },
      { title: "Ligação covalente" },
      { title: "Ligação metálica" },
      { title: "Forças intermoleculares" },
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
    topics: [
      { title: "Raio atômico" },
      { title: "Energia de ionização" },
      { title: "Afinidade eletrônica" },
      { title: "Eletronegatividade" },
      { title: "Caráter metálico" },
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

  const {
    progress,
    loading,
  } = useProgress();

  const [active, setActive] = useState<number | null>(null);

  /*
   * Cada quiz concluído representa um avanço no conteúdo.
   *
   * Como ainda não temos no banco uma relação direta entre
   * quiz -> módulo -> tópico, os avanços são distribuídos
   * sequencialmente pelos tópicos disponíveis.
   */
  const modulesWithProgress = useMemo(() => {
    const quizzesCompleted = progress?.quizzes_completed ?? 0;

    let remainingCompletedTopics = quizzesCompleted;

    return MODULES.map((module) => {
      const totalTopics = module.topics.length;

      const completedTopics = Math.min(
        totalTopics,
        Math.max(0, remainingCompletedTopics),
      );

      remainingCompletedTopics = Math.max(
        0,
        remainingCompletedTopics - totalTopics,
      );

      const moduleProgress =
        totalTopics > 0
          ? Math.round((completedTopics / totalTopics) * 100)
          : 0;

      return {
        ...module,

        progress: moduleProgress,

        completedTopics,

        topics: module.topics.map((topic, index) => ({
          ...topic,
          done: index < completedTopics,
        })),
      };
    });
  }, [progress?.quizzes_completed]);

  const mod =
    active !== null
      ? modulesWithProgress.find((m) => m.id === active)
      : null;

  const totalTopics = useMemo(() => {
    return MODULES.reduce(
      (total, module) => total + module.topics.length,
      0,
    );
  }, []);

  const totalXpPossible = useMemo(() => {
    return MODULES.reduce(
      (total, module) => total + module.xp,
      0,
    );
  }, []);

  const totalMinutes = useMemo(() => {
    return MODULES.reduce((total, module) => {
      const minutes = parseInt(module.duration, 10);

      return total + (Number.isNaN(minutes) ? 0 : minutes);
    }, 0);
  }, []);

  const formattedDuration = useMemo(() => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `~${minutes} min`;
    }

    if (minutes === 0) {
      return `~${hours}h`;
    }

    return `~${hours}h ${minutes}min`;
  }, [totalMinutes]);

  const completedTopicsTotal = useMemo(() => {
    return modulesWithProgress.reduce(
      (total, module) => total + module.completedTopics,
      0,
    );
  }, [modulesWithProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center py-20">
            <div className="text-slate-500">
              Carregando seu progresso...
            </div>
          </div>
        </div>
      </div>
    );
  }

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

            <div
              className={`h-2 rounded-full bg-gradient-to-r ${COLOR_MAP[mod.color]} mb-6`}
            />

            <div className="flex items-start justify-between gap-6 flex-wrap mb-8">

              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {mod.title}
                </h1>

                <p className="text-slate-500">
                  {mod.desc}
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${BG_MAP[mod.color]}`}
                >
                  ⚡ +{mod.xp} XP
                </span>

                <span className="text-sm text-slate-500">
                  ⏱ {mod.duration}
                </span>

              </div>

            </div>

            <div className="grid lg:grid-cols-3 gap-8">

              {/* Topics */}

              <div>

                <h2 className="font-bold text-slate-900 mb-4 text-lg">
                  Tópicos
                </h2>

                <div className="space-y-2">

                  {mod.topics.map((topic, index) => (

                    <div
                      key={topic.title}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        topic.done
                          ? "bg-green-50 border-green-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          topic.done
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {topic.done ? "✓" : index + 1}
                      </div>

                      <span
                        className={`text-sm font-medium ${
                          topic.done
                            ? "text-green-800"
                            : "text-slate-600"
                        }`}
                      >
                        {topic.title}
                      </span>

                    </div>

                  ))}

                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">

                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Progresso do módulo</span>

                    <span>
                      {mod.completedTopics}/{mod.topics.length} tópicos
                    </span>
                  </div>

                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${COLOR_MAP[mod.color]}`}
                      style={{
                        width: `${mod.progress}%`,
                      }}
                    />

                  </div>

                  <div className="text-right text-xs font-mono text-slate-500 mt-1">
                    {mod.progress}%
                  </div>

                </div>

              </div>

              {/* Content */}

              <div className="lg:col-span-2">

                <h2 className="font-bold text-slate-900 mb-4 text-lg">
                  Conteúdo
                </h2>

                <div className="prose prose-slate prose-sm max-w-none">

                  {mod.content.split("\n\n").map((para, index) => (

                    <p
                      key={index}
                      className="text-slate-600 leading-relaxed mb-4"
                    >

                      {para.split(/\*\*(.*?)\*\*/).map(
                        (part, partIndex) =>
                          partIndex % 2 === 1 ? (

                            <strong
                              key={partIndex}
                              className="text-slate-900 font-semibold"
                            >
                              {part}
                            </strong>

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

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Aprenda Química
            </h1>

            <p className="text-slate-500 mb-10">
              Módulos interativos para dominar os fundamentos da Química.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">

              {modulesWithProgress.map((module) => (

                <button
                  key={module.id}
                  onClick={() => setActive(module.id)}
                  className="text-left bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                >

                  <div
                    className={`h-1.5 bg-gradient-to-r ${COLOR_MAP[module.color]}`}
                  />

                  <div className="p-6">

                    <div className="flex items-start justify-between mb-4">

                      <div className="text-3xl">
                        {module.icon}
                      </div>

                      <div className="text-right">

                        <div className="text-xs font-mono text-slate-400">
                          {module.duration}
                        </div>

                        <div
                          className={`text-xs font-semibold mt-1 ${
                            BG_MAP[module.color].split(" ")[2]
                          }`}
                        >
                          +{module.xp} XP
                        </div>

                      </div>

                    </div>

                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                      {module.title}
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed mb-5">
                      {module.desc}
                    </p>

                    {/* Progress */}

                    <div>

                      <div className="flex justify-between text-xs mb-1.5">

                        <span className="text-slate-500">
                          {module.completedTopics}/
                          {module.topics.length} tópicos
                        </span>

                        <span className="font-mono text-slate-400">
                          {module.progress}%
                        </span>

                      </div>

                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${COLOR_MAP[module.color]}`}
                          style={{
                            width: `${module.progress}%`,
                          }}
                        />

                      </div>

                    </div>

                    <div className="mt-4 text-sm font-medium text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">

                      {module.progress === 0
                        ? "Começar módulo"
                        : module.progress === 100
                          ? "Revisar"
                          : "Continuar"} →

                    </div>

                  </div>

                </button>

              ))}

            </div>

            {/* Stats summary */}

            <div className="mt-10 grid sm:grid-cols-4 gap-4">

              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">

                <div className="text-2xl font-bold text-slate-900">
                  {MODULES.length}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Módulos disponíveis
                </div>

              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">

                <div className="text-2xl font-bold text-slate-900">
                  {completedTopicsTotal}/{totalTopics}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Tópicos concluídos
                </div>

              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">

                <div className="text-2xl font-bold text-slate-900">
                  {progress?.xp ?? 0}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  XP conquistado
                </div>

              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">

                <div className="text-2xl font-bold text-slate-900">
                  {formattedDuration}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Tempo estimado
                </div>

              </div>

            </div>

            <div className="mt-6 text-center text-sm text-slate-400">

              {progress?.quizzes_completed ?? 0} quizzes concluídos •{" "}
              {progress?.correct_answers ?? 0} respostas corretas

            </div>

          </div>

        )}

      </div>
    </div>
  );
}