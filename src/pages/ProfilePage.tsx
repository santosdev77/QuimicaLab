import { useNavigate } from "react-router";

const BADGES = [
  { name: "Mestre dos Elementos", icon: "🏆", earned: true, xp: 500 },
  { name: "Conhecedor da Tabela", icon: "📊", earned: true, xp: 300 },
  { name: "10 Desafios", icon: "⚔️", earned: true, xp: 200 },
  { name: "Primeiro Experimento", icon: "🧪", earned: false, xp: 150 },
  { name: "100 Questões", icon: "💯", earned: false, xp: 400 },
  { name: "Sem Erros", icon: "⭐", earned: false, xp: 250 },
];

const ACTIVITY = [
  { day: "Seg", minutes: 25, xp: 180 },
  { day: "Ter", minutes: 40, xp: 320 },
  { day: "Qua", minutes: 15, xp: 90 },
  { day: "Qui", minutes: 50, xp: 410 },
  { day: "Sex", minutes: 35, xp: 250 },
  { day: "Sab", minutes: 60, xp: 520 },
  { day: "Dom", minutes: 20, xp: 140 },
];

const maxMinutes = Math.max(...ACTIVITY.map(a => a.minutes));

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl text-white">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl shadow-lg">
            🎓
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Estudante QuímicaLab</h1>
            <p className="text-blue-200 text-sm mt-0.5">Explorador Químico · Nível 12</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span>📅 Membro desde Jan 2025</span>
              <span>🔥 7 dias seguidos</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono">2.450</div>
            <div className="text-blue-200 text-sm">XP total</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: "📝", label: "Questões Respondidas", value: "148" },
                { icon: "✅", label: "Taxa de Acerto", value: "89%" },
                { icon: "🧪", label: "Experimentos", value: "3" },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Weekly activity chart */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5">Atividade Semanal</h2>
              <div className="flex items-end gap-3 h-32">
                {ACTIVITY.map(day => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-blue-100 rounded-t-lg relative group transition-all hover:bg-blue-200"
                      style={{ height: `${(day.minutes / maxMinutes) * 100}%`, minHeight: 4 }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.minutes}min
                      </div>
                      <div className="w-full h-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-xs text-slate-400">
                <span>Total: {ACTIVITY.reduce((a, d) => a + d.minutes, 0)} min</span>
                <span>XP semanal: {ACTIVITY.reduce((a, d) => a + d.xp, 0)}</span>
              </div>
            </div>

            {/* Progress by topic */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5">Progresso por Tema</h2>
              {[
                { label: "Estrutura Atômica", pct: 85, color: "bg-blue-500" },
                { label: "Distribuição Eletrônica", pct: 60, color: "bg-violet-500" },
                { label: "Ligações Químicas", pct: 40, color: "bg-teal-500" },
                { label: "Propriedades Periódicas", pct: 20, color: "bg-orange-500" },
                { label: "Tabela Periódica", pct: 75, color: "bg-blue-400" },
              ].map(item => (
                <div key={item.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-400 font-mono">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Level card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <div className="text-blue-200 text-sm mb-1">Nível atual</div>
              <div className="text-6xl font-extrabold mb-1">12</div>
              <div className="text-sm text-blue-200 mb-4">Explorador Químico</div>
              <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white/70 rounded-full" style={{ width: "82%" }} />
              </div>
              <div className="flex justify-between text-xs text-blue-200">
                <span>2.450 XP</span>
                <span>3.000 XP</span>
              </div>
              <div className="mt-4 text-xs text-blue-200 text-center">550 XP para o Nível 13</div>
            </div>

            {/* Badges */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Conquistas</h2>
              <div className="grid grid-cols-3 gap-3">
                {BADGES.map(badge => (
                  <div
                    key={badge.name}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                      badge.earned
                        ? "bg-blue-50 border-blue-200 hover:shadow-sm cursor-pointer"
                        : "bg-slate-100 border-slate-200 grayscale opacity-40"
                    }`}
                    title={badge.name}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="text-[9px] font-semibold text-slate-700 leading-tight">{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-2">
              {[
                { label: "Continuar estudando", icon: "📚", to: "/aprender", primary: true },
                { label: "Ir para desafios", icon: "⚔️", to: "/desafios", primary: false },
                { label: "Ver tabela periódica", icon: "⚗️", to: "/tabela", primary: false },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                    action.primary
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{action.icon}</span>
                  {action.label}
                  <span className="ml-auto">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
