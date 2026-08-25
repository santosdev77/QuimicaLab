import { useState, useCallback } from "react";
import { quizQuestions } from "../data/quizData";

type QuizState = "start" | "playing" | "result";

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};
const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  hard: "bg-red-50 text-red-700 border-red-200",
};

export default function QuizPage() {
  const [state, setState] = useState<QuizState>("start");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [xp, setXp] = useState(2450);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = quizQuestions[currentIdx];
  const isLast = currentIdx === quizQuestions.length - 1;

  const startQuiz = () => {
    setState("playing");
    setCurrentIdx(0);
    setSelected(null);
    setAnswers([]);
    setShowExplanation(false);
  };

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const gained = idx === question.correctIndex
      ? question.difficulty === "hard" ? 40 : question.difficulty === "medium" ? 30 : 20
      : 0;
    setXp(v => v + gained);
    setAnswers(prev => [...prev, idx]);
  }, [selected, question]);

  const next = () => {
    if (isLast) {
      setState("result");
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const correct = answers.filter((a, i) => a === quizQuestions[i]?.correctIndex).length;
  const pct = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;

  const STATS = [
    { label: "XP Total", value: xp.toLocaleString("pt-BR"), icon: "⚡" },
    { label: "Nível", value: "12", icon: "🎯" },
    { label: "Sequência", value: "7 dias", icon: "🔥" },
    { label: "Respondidas", value: "148", icon: "📝" },
    { label: "Taxa de acerto", value: "89%", icon: "✅" },
  ];

  if (state === "start") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Desafios</h1>
          <p className="text-slate-500 mb-10">Teste seus conhecimentos, ganhe XP e suba de nível!</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
            {STATS.map(s => (
              <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* XP bar */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-xl">Nível 12 — Explorador Químico</div>
                <div className="text-blue-200 text-sm">2.450 / 3.000 XP</div>
              </div>
              <div className="text-5xl font-extrabold font-mono text-white/90">12</div>
            </div>
            <div className="h-3 bg-blue-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: "82%" }} />
            </div>
          </div>

          {/* Question preview */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-4">Banco de questões</h2>
              <div className="space-y-2">
                {quizQuestions.slice(0, 6).map((q, i) => (
                  <div key={q.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-700 font-medium truncate">{q.question}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{q.topic}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${DIFFICULTY_COLORS[q.difficulty]}`}>
                      {DIFFICULTY_LABELS[q.difficulty]}
                    </span>
                  </div>
                ))}
                <div className="text-center text-sm text-slate-400 py-1">
                  +{quizQuestions.length - 6} questões adicionais
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
                <div className="text-5xl mb-4">🧪</div>
                <h3 className="text-xl font-bold mb-2">Pronto para o desafio?</h3>
                <p className="text-blue-200 text-sm mb-6 leading-relaxed">
                  {quizQuestions.length} questões sobre Química. Ganhe até 40 XP por resposta correta!
                </p>
                <button
                  onClick={startQuiz}
                  className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg w-full"
                >
                  Começar Quiz →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === "result") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📚"}</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {pct >= 80 ? "Excelente!" : pct >= 50 ? "Bom trabalho!" : "Continue estudando!"}
          </h1>
          <p className="text-slate-500 mb-8">Você concluiu o quiz</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <div className="text-3xl font-bold text-slate-900">{correct}</div>
              <div className="text-sm text-slate-500 mt-1">Acertos</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <div className="text-3xl font-bold text-slate-900">{pct}%</div>
              <div className="text-sm text-slate-500 mt-1">Aproveitamento</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="text-3xl font-bold text-blue-600">+{xp - 2450}</div>
              <div className="text-sm text-blue-500 mt-1">XP ganho</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={startQuiz}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
            <button
              onClick={() => setState("start")}
              className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Ver estatísticas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  const progress = ((currentIdx) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setState("start")}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-mono text-slate-400 w-14 text-right">
            {currentIdx + 1}/{quizQuestions.length}
          </span>
        </div>

        {/* XP indicator */}
        <div className="flex items-center justify-between mb-8">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${DIFFICULTY_COLORS[question.difficulty]}`}>
            {DIFFICULTY_LABELS[question.difficulty]}
          </span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
            ⚡ +{question.difficulty === "hard" ? 40 : question.difficulty === "medium" ? 30 : 20} XP
          </span>
        </div>

        {/* Question */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="text-xs text-slate-400 mb-3 font-medium">{question.topic}</div>
          <h2 className="text-xl font-bold text-slate-900 leading-snug">{question.question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((opt, idx) => {
            const isCorrect = idx === question.correctIndex;
            const isSelected = selected === idx;
            let cls = "w-full text-left px-5 py-4 rounded-xl border font-medium transition-all duration-150 ";
            if (selected === null) {
              cls += "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
            } else if (isCorrect) {
              cls += "bg-green-50 border-green-400 text-green-800";
            } else if (isSelected) {
              cls += "bg-red-50 border-red-400 text-red-800";
            } else {
              cls += "bg-slate-50 border-slate-200 text-slate-400 cursor-default";
            }

            return (
              <button key={opt} className={cls} onClick={() => handleAnswer(idx)}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    selected === null ? "bg-slate-100 text-slate-500" :
                    isCorrect ? "bg-green-500 text-white" :
                    isSelected ? "bg-red-500 text-white" :
                    "bg-slate-100 text-slate-400"
                  }`}>
                    {selected !== null && isCorrect ? "✓" :
                     selected !== null && isSelected ? "✗" :
                     ["A","B","C","D"][idx]}
                  </span>
                  <span>{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`rounded-2xl p-4 mb-6 text-sm leading-relaxed ${
            selected === question.correctIndex
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-blue-50 border border-blue-200 text-blue-800"
          }`}>
            <strong className="block mb-1">
              {selected === question.correctIndex ? "✓ Correto!" : "✗ Incorreto"}
            </strong>
            {question.explanation}
          </div>
        )}

        {/* Next */}
        {selected !== null && (
          <button
            onClick={next}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            {isLast ? "Ver resultado →" : "Próxima questão →"}
          </button>
        )}
      </div>
    </div>
  );
}
