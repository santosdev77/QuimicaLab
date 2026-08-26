import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

const ACHIEVEMENTS = [
  { icon: "🏆", name: "Mestre dos Elementos", desc: "Estudou todos os grupos da tabela", earned: true },
  { icon: "📊", name: "Conhecedor da Tabela", desc: "Consultou 50 elementos", earned: true },
  { icon: "⚔️", name: "10 Desafios", desc: "Completou 10 quizzes", earned: true },
  { icon: "🧪", name: "Primeiro Experimento", desc: "Completou um experimento virtual", earned: false },
  { icon: "💯", name: "100 Questões", desc: "Respondeu 100 questões", earned: false },
  { icon: "⭐", name: "Sem Erros", desc: "10 questões seguidas corretas", earned: false },
  { icon: "🔬", name: "Cientista Curioso", desc: "Leu detalhes de 20 elementos", earned: false },
  { icon: "📅", name: "Maratonista", desc: "30 dias seguidos de estudo", earned: false },
];

const RECENT_ACTIVITY = [
  { type: "quiz", label: "Quiz — Estrutura Atômica", result: "+180 XP", time: "Hoje, 14:30", success: true },
  { type: "lesson", label: "Aula — Distribuição Eletrônica", result: "+120 XP", time: "Hoje, 11:15", success: true },
  { type: "quiz", label: "Quiz — Tabela Periódica", result: "+80 XP", time: "Ontem, 20:00", success: true },
  { type: "element", label: "Elemento consultado — Ouro (Au)", result: "+10 XP", time: "Ontem, 18:45", success: true },
  { type: "quiz", label: "Quiz — Ligações Químicas", result: "+50 XP", time: "Seg, 16:00", success: false },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const earnedCount = ACHIEVEMENTS.filter(a => a.earned).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
          <div><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Área do aluno</p><h2 className="text-lg font-bold text-slate-900">Olá, {profile?.name ?? user?.user_metadata?.name ?? "Estudante"}</h2><p className="text-sm text-slate-500">{user?.email}</p></div>
          <div className="text-right"><p className="text-xl font-extrabold text-blue-700">{profile?.xp ?? 0} XP</p><p className="text-xs text-slate-500">Nível {profile?.level ?? 1}</p></div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard de Progresso</h1>
        <p className="text-slate-500 mb-10">Acompanhe sua evolução e conquistas em tempo real.</p>

        {/* Top metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "XP Total", value: "2.450", sub: "+180 hoje", icon: "⚡", trend: "up" },
            { label: "Nível", value: "12", sub: "Explorador Químico", icon: "🎯", trend: "up" },
            { label: "Sequência", value: "7 dias", sub: "Recorde: 12 dias 🔥", icon: "🔥", trend: "same" },
            { label: "Taxa de Acerto", value: "89%", sub: "+2% esta semana", icon: "✅", trend: "up" },
          ].map(m => (
            <div key={m.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{m.icon}</span>
                {m.trend === "up" && (
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">↑</span>
                )}
              </div>
              <div className="text-2xl font-bold text-slate-900">{m.value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{m.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
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
                  <div className="text-blue-200 text-sm">Nível atual</div>
                  <div className="text-4xl font-extrabold">12</div>
                  <div className="text-blue-200 text-sm">Explorador Químico</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-200 text-sm">Próximo nível</div>
                  <div className="text-3xl font-extrabold">13</div>
                  <div className="text-blue-200 text-sm">Pesquisador</div>
                </div>
              </div>
              <div className="h-3 bg-blue-900/50 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white/80 rounded-full" style={{ width: "82%" }} />
              </div>
              <div className="flex justify-between text-xs text-blue-200">
                <span>2.450 XP</span>
                <span>550 XP restantes</span>
                <span>3.000 XP</span>
              </div>
            </div>

            {/* Content progress */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">Progresso por Conteúdo</h2>
                <button
                  onClick={() => navigate("/aprender")}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  Ver módulos →
                </button>
              </div>
              {[
                { label: "Estrutura Atômica", pct: 85, done: "5/5", color: "bg-blue-500" },
                { label: "Distribuição Eletrônica", pct: 60, done: "3/5", color: "bg-violet-500" },
                { label: "Ligações Químicas", pct: 40, done: "2/5", color: "bg-teal-500" },
                { label: "Propriedades Periódicas", pct: 20, done: "1/5", color: "bg-orange-500" },
              ].map(item => (
                <div key={item.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">{item.done} tópicos</span>
                      <span className="text-slate-500 font-mono text-xs">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5">Atividade Recente</h2>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((act, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                      act.type === "quiz" ? "bg-blue-100" :
                      act.type === "lesson" ? "bg-violet-100" :
                      "bg-teal-100"
                    }`}>
                      {act.type === "quiz" ? "🧩" : act.type === "lesson" ? "📚" : "🔬"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-slate-800 truncate">{act.label}</div>
                      <div className="text-xs text-slate-400">{act.time}</div>
                    </div>
                    <div className={`text-xs font-semibold whitespace-nowrap ${
                      act.success ? "text-green-600" : "text-slate-400"
                    }`}>
                      {act.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — achievements */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">Conquistas</h2>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {earnedCount}/{ACHIEVEMENTS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${(earnedCount / ACHIEVEMENTS.length) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {ACHIEVEMENTS.length - earnedCount} conquistas restantes
                </div>
              </div>

              <div className="space-y-3">
                {ACHIEVEMENTS.map(badge => (
                  <div
                    key={badge.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      badge.earned
                        ? "bg-blue-50 border-blue-200"
                        : "bg-slate-50 border-slate-100 opacity-50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                      badge.earned ? "bg-white shadow-sm" : "bg-slate-200"
                    }`}>
                      {badge.earned ? badge.icon : "🔒"}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-semibold truncate ${badge.earned ? "text-slate-900" : "text-slate-400"}`}>
                        {badge.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{badge.desc}</div>
                    </div>
                    {badge.earned && (
                      <div className="ml-auto flex-shrink-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <h2 className="font-bold text-slate-900 mb-4 text-sm">Resumo Total</h2>
              <div className="space-y-2">
                {[
                  { label: "Questões respondidas", value: "148" },
                  { label: "Acertos totais", value: "132" },
                  { label: "Elementos estudados", value: "47" },
                  { label: "Experimentos feitos", value: "3" },
                  { label: "Tempo de estudo", value: "18h 42min" },
                ].map(s => (
                  <div key={s.label} className="flex justify-between py-1.5 border-b border-slate-200 last:border-0">
                    <span className="text-xs text-slate-500">{s.label}</span>
                    <span className="text-xs font-bold font-mono text-slate-900">{s.value}</span>
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
