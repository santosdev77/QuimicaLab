import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabase";

type UserProgress = {
  user_id: string;

  streak: number;
  best_streak: number;

  questions_answered: number;
  correct_answers: number;

  elements_studied: number;
  experiments_completed: number;

  study_minutes: number;

  atomic_structure_progress: number;
  electronic_distribution_progress: number;
  chemical_bonds_progress: number;
  periodic_properties_progress: number;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar progresso:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setProgress(data);
      } else {
        const { data: newProgress, error: insertError } = await supabase
          .from("user_progress")
          .insert({
            user_id: user.id,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Erro ao criar progresso:", insertError);
        } else {
          setProgress(newProgress);
        }
      }

      setLoading(false);
    }

    loadProgress();
  }, [user]);

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;

  const questionsAnswered = progress?.questions_answered ?? 0;
  const correctAnswers = progress?.correct_answers ?? 0;

  const accuracy =
    questionsAnswered > 0
      ? Math.round((correctAnswers / questionsAnswered) * 100)
      : 0;

  const streak = progress?.streak ?? 0;
  const bestStreak = progress?.best_streak ?? 0;

  const elementsStudied = progress?.elements_studied ?? 0;
  const experimentsCompleted = progress?.experiments_completed ?? 0;
  const studyMinutes = progress?.study_minutes ?? 0;

  const atomicProgress = Math.min(
    100,
    Math.max(0, progress?.atomic_structure_progress ?? 0)
  );

  const electronicProgress = Math.min(
    100,
    Math.max(0, progress?.electronic_distribution_progress ?? 0)
  );

  const bondsProgress = Math.min(
    100,
    Math.max(0, progress?.chemical_bonds_progress ?? 0)
  );

  const periodicProgress = Math.min(
    100,
    Math.max(0, progress?.periodic_properties_progress ?? 0)
  );

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours <= 0) {
      return `${remainingMinutes} min`;
    }

    return `${hours}h ${remainingMinutes}min`;
  };

  const formatTopics = (percentage: number) => {
    const totalTopics = 5;
    const completedTopics = Math.round(
      (percentage / 100) * totalTopics
    );

    return `${completedTopics}/${totalTopics}`;
  };

  /*
    Como ainda não existe uma tabela de histórico de atividades,
    não vamos mostrar atividades imaginárias no Dashboard.
    Quando criarmos essa tabela futuramente, este array poderá
    ser preenchido com dados reais do Supabase.
  */
  const RECENT_ACTIVITY: {
    type: "quiz" | "lesson" | "element";
    label: string;
    result: string;
    time: string;
    success: boolean;
  }[] = [];

  const ACHIEVEMENTS = [
    {
      icon: "🏆",
      name: "Mestre dos Elementos",
      desc: "Estudou todos os grupos da tabela",
      earned: elementsStudied >= 50,
    },
    {
      icon: "📊",
      name: "Conhecedor da Tabela",
      desc: "Consultou 50 elementos",
      earned: elementsStudied >= 50,
    },
    {
      icon: "⚔️",
      name: "10 Desafios",
      desc: "Alcançou 10 questões respondidas",
      earned: questionsAnswered >= 10,
    },
    {
      icon: "🧪",
      name: "Primeiro Experimento",
      desc: "Completou um experimento virtual",
      earned: experimentsCompleted >= 1,
    },
    {
      icon: "💯",
      name: "100 Questões",
      desc: "Respondeu 100 questões",
      earned: questionsAnswered >= 100,
    },
    {
      icon: "⭐",
      name: "Sem Erros",
      desc: "10 questões seguidas corretas",
      earned: false,
    },
    {
      icon: "🔬",
      name: "Cientista Curioso",
      desc: "Leu detalhes de 20 elementos",
      earned: elementsStudied >= 20,
    },
    {
      icon: "📅",
      name: "Maratonista",
      desc: "30 dias seguidos de estudo",
      earned: streak >= 30,
    },
  ];

  const earnedCount = ACHIEVEMENTS.filter(
    (achievement) => achievement.earned
  ).length;

  const contentProgress = [
    {
      label: "Estrutura Atômica",
      pct: atomicProgress,
      done: formatTopics(atomicProgress),
      color: "bg-blue-500",
    },
    {
      label: "Distribuição Eletrônica",
      pct: electronicProgress,
      done: formatTopics(electronicProgress),
      color: "bg-violet-500",
    },
    {
      label: "Ligações Químicas",
      pct: bondsProgress,
      done: formatTopics(bondsProgress),
      color: "bg-teal-500",
    },
    {
      label: "Propriedades Periódicas",
      pct: periodicProgress,
      done: formatTopics(periodicProgress),
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Área do aluno */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Área do aluno
            </p>

            <h2 className="text-lg font-bold text-slate-900">
              Olá,{" "}
              {profile?.name ??
                user?.user_metadata?.name ??
                "Estudante"}
            </h2>

            <p className="text-sm text-slate-500">
              {user?.email}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl font-extrabold text-blue-700">
              {xp.toLocaleString("pt-BR")} XP
            </p>

            <p className="text-xs text-slate-500">
              Nível {level}
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard de Progresso
        </h1>

        <p className="text-slate-500 mb-10">
          Acompanhe sua evolução e conquistas em tempo real.
        </p>

        {/* Top metrics */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "XP Total",
              value: loading
                ? "..."
                : xp.toLocaleString("pt-BR"),
              sub: "XP acumulado",
              icon: "⚡",
              trend: "up",
            },
            {
              label: "Nível",
              value: loading
                ? "..."
                : level.toString(),
              sub: "Seu nível atual",
              icon: "🎯",
              trend: "up",
            },
            {
              label: "Sequência",
              value: loading
                ? "..."
                : `${streak} dias`,
              sub: `Recorde: ${bestStreak} dias 🔥`,
              icon: "🔥",
              trend: "same",
            },
            {
              label: "Taxa de Acerto",
              value: loading
                ? "..."
                : `${accuracy}%`,
              sub:
                questionsAnswered > 0
                  ? `${correctAnswers} acertos`
                  : "Nenhuma questão respondida",
              icon: "✅",
              trend: "up",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">
                  {metric.icon}
                </span>

                {metric.trend === "up" && (
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    ↑
                  </span>
                )}
              </div>

              <div className="text-2xl font-bold text-slate-900">
                {metric.value}
              </div>

              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {metric.label}
              </div>

              <div className="text-[10px] text-slate-400 mt-0.5">
                {metric.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — progress and activity */}

          <div className="lg:col-span-2 space-y-6">
            {/* Level progress */}

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-blue-200 text-sm">
                    Nível atual
                  </div>

                  <div className="text-4xl font-extrabold">
                    {loading ? "..." : level}
                  </div>

                  <div className="text-blue-200 text-sm">
                    Seu nível atual
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-blue-200 text-sm">
                    Próximo nível
                  </div>

                  <div className="text-3xl font-extrabold">
                    {loading ? "..." : level + 1}
                  </div>

                  <div className="text-blue-200 text-sm">
                    Continue estudando
                  </div>
                </div>
              </div>

              <div className="h-3 bg-blue-900/50 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-white/80 rounded-full"
                  style={{
                    width: xp > 0 ? "100%" : "0%",
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-blue-200">
                <span>
                  {loading
                    ? "..."
                    : `${xp.toLocaleString("pt-BR")} XP`}
                </span>

                <span>
                  Continue estudando
                </span>

                <span>
                  Nível {level + 1}
                </span>
              </div>
            </div>

            {/* Content progress */}

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">
                  Progresso por Conteúdo
                </h2>

                <button
                  onClick={() => navigate("/aprender")}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  Ver módulos →
                </button>
              </div>

              {contentProgress.map((item) => (
                <div
                  key={item.label}
                  className="mb-4 last:mb-0"
                >
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">
                        {item.done} tópicos
                      </span>

                      <span className="text-slate-500 font-mono text-xs">
                        {item.pct}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${item.pct}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent activity */}

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5">
                Atividade Recente
              </h2>

              {RECENT_ACTIVITY.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl">
                  <div className="text-3xl mb-2">
                    📚
                  </div>

                  <p className="text-sm font-medium text-slate-600">
                    Ainda não há atividades registradas.
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Suas próximas atividades aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                          activity.type === "quiz"
                            ? "bg-blue-100"
                            : activity.type === "lesson"
                            ? "bg-violet-100"
                            : "bg-teal-100"
                        }`}
                      >
                        {activity.type === "quiz"
                          ? "🧩"
                          : activity.type === "lesson"
                          ? "📚"
                          : "🔬"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-800 truncate">
                          {activity.label}
                        </div>

                        <div className="text-xs text-slate-400">
                          {activity.time}
                        </div>
                      </div>

                      <div
                        className={`text-xs font-semibold whitespace-nowrap ${
                          activity.success
                            ? "text-green-600"
                            : "text-slate-400"
                        }`}
                      >
                        {activity.result}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — achievements */}

          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">
                  Conquistas
                </h2>

                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {earnedCount}/{ACHIEVEMENTS.length}
                </span>
              </div>

              {/* Progress bar */}

              <div className="mb-5">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{
                      width: `${
                        (earnedCount /
                          ACHIEVEMENTS.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  {ACHIEVEMENTS.length -
                    earnedCount}{" "}
                  conquistas restantes
                </div>
              </div>

              <div className="space-y-3">
                {ACHIEVEMENTS.map((badge) => (
                  <div
                    key={badge.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      badge.earned
                        ? "bg-blue-50 border-blue-200"
                        : "bg-slate-50 border-slate-100 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                        badge.earned
                          ? "bg-white shadow-sm"
                          : "bg-slate-200"
                      }`}
                    >
                      {badge.earned
                        ? badge.icon
                        : "🔒"}
                    </div>

                    <div className="min-w-0">
                      <div
                        className={`text-xs font-semibold truncate ${
                          badge.earned
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {badge.name}
                      </div>

                      <div className="text-[10px] text-slate-400 truncate">
                        {badge.desc}
                      </div>
                    </div>

                    {badge.earned && (
                      <div className="ml-auto flex-shrink-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <h2 className="font-bold text-slate-900 mb-4 text-sm">
                Resumo Total
              </h2>

              <div className="space-y-2">
                {[
                  {
                    label: "Questões respondidas",
                    value: loading
                      ? "..."
                      : questionsAnswered.toString(),
                  },
                  {
                    label: "Acertos totais",
                    value: loading
                      ? "..."
                      : correctAnswers.toString(),
                  },
                  {
                    label: "Elementos estudados",
                    value: loading
                      ? "..."
                      : elementsStudied.toString(),
                  },
                  {
                    label: "Experimentos feitos",
                    value: loading
                      ? "..."
                      : experimentsCompleted.toString(),
                  },
                  {
                    label: "Tempo de estudo",
                    value: loading
                      ? "..."
                      : formatStudyTime(
                          studyMinutes
                        ),
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex justify-between py-1.5 border-b border-slate-200 last:border-0"
                  >
                    <span className="text-xs text-slate-500">
                      {stat.label}
                    </span>

                    <span className="text-xs font-bold font-mono text-slate-900">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}