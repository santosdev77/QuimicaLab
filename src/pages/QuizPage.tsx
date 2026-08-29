import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { quizQuestions } from "../data/quizData";
import { useProgress } from "../progress/ProgressContext";

type QuizState = "start" | "playing" | "result";

const pointsFor = (difficulty: string) =>
  difficulty === "hard" ? 40 : difficulty === "medium" ? 30 : 20;

const difficultyLabel: Record<string, string> = {
  easy: "Facil",
  medium: "Medio",
  hard: "Dificil",
};

const difficultyColor: Record<string, string> = {
  easy: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  hard: "bg-red-50 text-red-700 border-red-200",
};

export default function QuizPage() {
  const { user } = useAuth();

  const {
    progress: userProgress,
    loading,
    error: progressError,
    recordQuiz,
  } = useProgress();

  const navigate = useNavigate();

  const [state, setState] = useState<QuizState>("start");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const question = quizQuestions[currentIdx];

  const isLast =
    currentIdx === quizQuestions.length - 1;

  const correct = answers.filter(
    (answer, index) =>
      answer === quizQuestions[index]?.correctIndex
  ).length;

  const pct = answers.length
    ? Math.round(
        (correct / answers.length) * 100
      )
    : 0;

  const earnedXp = answers.reduce(
    (total, answer, index) =>
      answer ===
      quizQuestions[index]?.correctIndex
        ? total +
          pointsFor(
            quizQuestions[index].difficulty
          )
        : total,
    0
  );

  const xp = userProgress?.xp ?? 0;

  const level = Math.max(
    1,
    Math.floor(xp / 250) + 1
  );

  const levelStart =
    (level - 1) * 250;

  const levelEnd =
    level * 250;

  const progress = Math.min(
    100,
    Math.max(
      0,
      ((xp - levelStart) / 250) * 100
    )
  );

  const stats = [
    {
      label: "XP Total",
      value: xp.toLocaleString("pt-BR"),
      mark: "XP",
    },
    {
      label: "Nivel",
      value: String(level),
      mark: "NV",
    },
    {
      label: "Sequencia",
      value: `${
        userProgress?.current_streak ?? 0
      } dias`,
      mark: "ST",
    },
    {
      label: "Respondidas",
      value: String(
        userProgress?.total_answers ?? 0
      ),
      mark: "QS",
    },
    {
      label: "Taxa de acerto",
      value:
        userProgress?.total_answers
          ? `${Math.round(
              (userProgress.correct_answers /
                userProgress.total_answers) *
                100
            )}%`
          : "0%",
      mark: "%",
    },
  ];

  const startQuiz = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setState("playing");
    setCurrentIdx(0);
    setSelected(null);
    setAnswers([]);
    setError("");
    setSaving(false);
  };

  const answer = (index: number) => {
    if (selected !== null) return;

    setSelected(index);

    setAnswers((current) => [
      ...current,
      index,
    ]);
  };

  const next = async () => {
    if (!isLast) {
      setCurrentIdx((index) => index + 1);
      setSelected(null);
      return;
    }

    if (saving) return;

    setSaving(true);
    setError("");

    /*
      Neste ponto "answers" já contém todas
      as respostas, inclusive a última,
      porque o botão só aparece depois
      que uma alternativa é selecionada.
    */

    const finalAnswers = [...answers];

    const finalCorrect =
      finalAnswers.filter(
        (answer, index) =>
          answer ===
          quizQuestions[index]?.correctIndex
      ).length;

    const finalXp =
      finalAnswers.reduce(
        (total, answer, index) =>
          answer ===
          quizQuestions[index]?.correctIndex
            ? total +
              pointsFor(
                quizQuestions[index].difficulty
              )
            : total,
        0
      );

    const saved = await recordQuiz({
      xp: finalXp,
      correctAnswers: finalCorrect,
      totalAnswers: finalAnswers.length,
    });

    if (!saved) {
      setError(
        "Seu resultado foi exibido, mas nao foi salvo. Tente novamente mais tarde."
      );
    }

    setSaving(false);
    setState("result");
  };

  if (state === "start") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Desafios
          </h1>

          <p className="mb-8 mt-2 text-slate-500">
            Teste seus conhecimentos,
            ganhe XP e acompanhe seu
            proprio progresso.
          </p>

          {!user && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">

              <span>
                Entre na sua conta para
                registrar seus resultados
                pessoais.
              </span>

              <button
                onClick={() =>
                  navigate("/login")
                }
                className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white"
              >
                Entrar
              </button>
            </div>
          )}

          {(error || progressError) && (
            <p className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              {error || progressError}
            </p>
          )}

          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-5">

            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-[10px] font-extrabold text-blue-700">
                  {stat.mark}
                </div>

                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {loading
                    ? "..."
                    : stat.value}
                </div>

                <div className="mt-0.5 text-xs text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}

          </div>

          <section className="mb-8 rounded-2xl bg-blue-600 p-6 text-white">

            <div className="mb-3 flex items-center justify-between">

              <div>
                <div className="text-xl font-bold">
                  Nivel {level}
                </div>

                <div className="text-sm text-blue-200">
                  {xp.toLocaleString(
                    "pt-BR"
                  )}{" "}
                  /{" "}
                  {levelEnd.toLocaleString(
                    "pt-BR"
                  )}{" "}
                  XP
                </div>
              </div>

              <div className="font-mono text-5xl font-extrabold text-white/90">
                {level}
              </div>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-blue-900/50">

              <div
                className="h-full rounded-full bg-white/80 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </section>

          <div className="grid gap-6 lg:grid-cols-2">

            <section>

              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Banco de questoes
              </h2>

              <div className="space-y-2">

                {quizQuestions
                  .slice(0, 6)
                  .map(
                    (item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                      >

                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                            {item.question}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {item.topic}
                          </p>

                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            difficultyColor[
                              item.difficulty
                            ]
                          }`}
                        >
                          {
                            difficultyLabel[
                              item.difficulty
                            ]
                          }
                        </span>

                      </div>
                    )
                  )}

              </div>

            </section>

            <section className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/15 text-lg font-extrabold">
                QZ
              </div>

              <h2 className="mt-4 text-xl font-bold">
                Pronto para o desafio?
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-blue-100">
                {quizQuestions.length}{" "}
                questoes de Quimica.
                Ganhe ate 40 XP por
                resposta correta.
              </p>

              <button
                onClick={startQuiz}
                className="mt-6 w-full rounded-xl bg-white px-8 py-3.5 font-bold text-blue-700 transition-colors hover:bg-blue-50"
              >
                {user
                  ? "Comecar quiz"
                  : "Entrar para comecar"}
              </button>

            </section>

          </div>

        </div>
      </div>
    );
  }

  if (state === "result") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">

        <div className="mx-auto max-w-2xl px-4 py-16 text-center">

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-lg font-extrabold text-blue-700">
            {pct}%
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
            {pct >= 80
              ? "Excelente!"
              : pct >= 50
              ? "Bom trabalho!"
              : "Continue estudando!"}
          </h1>

          <p className="mt-2 text-slate-500">
            Voce concluiu o quiz.
          </p>

          <div className="my-8 grid grid-cols-3 gap-4">

            <ResultCard
              value={String(correct)}
              label="Acertos"
            />

            <ResultCard
              value={`${pct}%`}
              label="Aproveitamento"
            />

            <ResultCard
              value={`+${earnedXp}`}
              label="XP ganho"
              accent
            />

          </div>

          {saving && (
            <p className="mb-4 text-sm text-slate-500">
              Salvando resultado...
            </p>
          )}

          {error && (
            <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              {error}
            </p>
          )}

          <div className="flex justify-center gap-3">

            <button
              onClick={startQuiz}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Tentar novamente
            </button>

            <button
              onClick={() =>
                setState("start")
              }
              className="rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 dark:text-slate-200"
            >
              Ver estatisticas
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">

      <div className="mx-auto max-w-2xl px-4 py-10">

        <div className="mb-6 flex items-center gap-3">

          <button
            onClick={() =>
              setState("start")
            }
            className="text-slate-400 hover:text-slate-600"
          >
            X
          </button>

          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-blue-600"
              style={{
                width: `${
                  ((currentIdx +
                    (selected !== null
                      ? 1
                      : 0)) /
                    quizQuestions.length) *
                  100
                }%`,
              }}
            />

          </div>

          <span className="w-14 text-right font-mono text-sm text-slate-400">
            {currentIdx + 1}/
            {quizQuestions.length}
          </span>

        </div>

        <div className="mb-6 flex items-center justify-between">

          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
              difficultyColor[
                question.difficulty
              ]
            }`}
          >
            {
              difficultyLabel[
                question.difficulty
              ]
            }
          </span>

          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
            +
            {pointsFor(
              question.difficulty
            )}{" "}
            XP
          </span>

        </div>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

          <p className="mb-3 text-xs font-medium text-slate-400">
            {question.topic}
          </p>

          <h2 className="text-xl font-bold leading-snug text-slate-900 dark:text-white">
            {question.question}
          </h2>

        </section>

        <div className="mb-6 space-y-3">

          {question.options.map(
            (option, index) => {
              const isCorrect =
                index ===
                question.correctIndex;

              const isSelected =
                selected === index;

              const style =
                selected === null
                  ? "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-200"
                  : isCorrect
                  ? "border-green-400 bg-green-50 text-green-800"
                  : isSelected
                  ? "border-red-400 bg-red-50 text-red-800"
                  : "border-slate-200 bg-slate-50 text-slate-400";

              return (
                <button
                  key={option}
                  onClick={() =>
                    answer(index)
                  }
                  className={`w-full rounded-xl border px-5 py-4 text-left font-medium transition-all ${style}`}
                >

                  <span className="mr-3 inline-grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {selected !== null &&
                    isCorrect
                      ? "OK"
                      : String.fromCharCode(
                          65 + index
                        )}
                  </span>

                  {option}

                </button>
              );
            }
          )}

        </div>

        {selected !== null && (
          <>

            <div
              className={`mb-6 rounded-xl p-4 text-sm ${
                selected ===
                question.correctIndex
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "border border-blue-200 bg-blue-50 text-blue-800"
              }`}
            >

              <b>
                {selected ===
                question.correctIndex
                  ? "Resposta correta."
                  : "Resposta incorreta."}
              </b>

              <p className="mt-1">
                {question.explanation}
              </p>

            </div>

            <button
              disabled={saving}
              onClick={() =>
                void next()
              }
              className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isLast
                ? "Ver resultado"
                : "Proxima questao"}
            </button>

          </>
        )}

      </div>

    </div>
  );
}

function ResultCard({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-blue-200 bg-blue-50"
          : "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
      }`}
    >

      <div
        className={`text-3xl font-bold ${
          accent
            ? "text-blue-600"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {label}
      </div>

    </div>
  );
}