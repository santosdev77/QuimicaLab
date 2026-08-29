import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabase";

export type UserProgress = {
  id: string;
  user_id: string;
  xp: number;
  quizzes_completed: number;
  correct_answers: number;
  total_answers: number;
  study_days: number;
  current_streak: number;
  created_at: string;
  updated_at: string;
};

type ProgressValue = {
  progress: UserProgress | null;
  loading: boolean;
  error: string | null;

  refreshProgress: () => Promise<void>;

  addXp: (amount: number) => Promise<boolean>;

  recordAnswer: (correct: boolean) => Promise<boolean>;

  recordQuiz: (result: {
    xp: number;
    correctAnswers: number;
    totalAnswers: number;
  }) => Promise<boolean>;
};

const ProgressContext = createContext<ProgressValue | undefined>(
  undefined
);

const initialProgress = (
  userId: string
): Omit<UserProgress, "id" | "created_at" | "updated_at"> => ({
  user_id: userId,
  xp: 0,
  quizzes_completed: 0,
  correct_answers: 0,
  total_answers: 0,
  study_days: 0,
  current_streak: 0,
});

export function ProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();

  const [progress, setProgress] =
    useState<UserProgress | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshProgress = useCallback(async () => {
    const userId = user?.id;

    if (!userId) {
      setProgress(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const {
      data,
      error: selectError,
    } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectError) {
      console.error(
        "Erro ao carregar user_progress:",
        selectError
      );

      setProgress(null);

      setError(
        "Não foi possível carregar seu progresso."
      );

      setLoading(false);
      return;
    }

    if (data) {
      setProgress(data as UserProgress);
      setLoading(false);
      return;
    }

    const {
      data: created,
      error: insertError,
    } = await supabase
      .from("user_progress")
      .insert(initialProgress(userId))
      .select("*")
      .single();

    if (insertError) {
      console.error(
        "Erro ao criar user_progress:",
        insertError
      );

      setProgress(null);

      setError(
        "Não foi possível iniciar seu progresso."
      );

      setLoading(false);
      return;
    }

    setProgress(created as UserProgress);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;

    void refreshProgress();
  }, [authLoading, refreshProgress]);

  /*
   * Atualiza o progresso usando os valores
   * mais recentes diretamente do Supabase.
   *
   * Isso evita problemas quando o estado
   * React ainda não foi atualizado.
   */
  const updateProgress = useCallback(
    async (
      calculateNext: (
        current: UserProgress
      ) => Partial<UserProgress>
    ) => {
      if (!user) {
        return false;
      }

      setError(null);

      /*
       * Primeiro buscamos os dados reais
       * e mais recentes do usuário.
       */
      const {
        data: currentData,
        error: currentError,
      } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (currentError) {
        console.error(
          "Erro ao buscar progresso atual:",
          currentError
        );

        setError(
          "Não foi possível carregar seu progresso."
        );

        return false;
      }

      let current =
        currentData as UserProgress | null;

      /*
       * Se por algum motivo ainda não existir
       * o registro, criamos automaticamente.
       */
      if (!current) {
        const {
          data: created,
          error: createError,
        } = await supabase
          .from("user_progress")
          .insert(initialProgress(user.id))
          .select("*")
          .single();

        if (createError || !created) {
          console.error(
            "Erro ao criar progresso:",
            createError
          );

          setError(
            "Não foi possível iniciar seu progresso."
          );

          return false;
        }

        current =
          created as UserProgress;
      }

      const next =
        calculateNext(current);

      const {
        data: updated,
        error: updateError,
      } = await supabase
        .from("user_progress")
        .update({
          ...next,
          updated_at:
            new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (updateError) {
        console.error(
          "Erro ao atualizar user_progress:",
          updateError
        );

        setError(
          "Não foi possível salvar seu progresso."
        );

        return false;
      }

      setProgress(
        updated as UserProgress
      );

      setError(null);

      return true;
    },
    [user]
  );

  const touchStudyDay = useCallback(
    (current: UserProgress) => {
      const today = new Date()
        .toISOString()
        .slice(0, 10);

      const previous =
        current.updated_at.slice(0, 10);

      /*
       * Se o usuário já teve atividade hoje,
       * não aumenta novamente.
       */
      if (previous === today) {
        return {
          study_days:
            current.study_days,
          current_streak:
            current.current_streak,
        };
      }

      const todayDate = new Date(
        `${today}T00:00:00Z`
      );

      const previousDate = new Date(
        `${previous}T00:00:00Z`
      );

      const daysSinceLastStudy =
        Math.round(
          (todayDate.getTime() -
            previousDate.getTime()) /
            86400000
        );

      return {
        study_days:
          current.study_days + 1,

        current_streak:
          daysSinceLastStudy === 1
            ? current.current_streak + 1
            : 1,
      };
    },
    []
  );

  const addXp = useCallback(
    async (amount: number) => {
      if (amount <= 0) {
        return false;
      }

      return updateProgress(
        (current) => ({
          xp:
            current.xp +
            Math.max(0, amount),

          ...touchStudyDay(current),
        })
      );
    },
    [
      updateProgress,
      touchStudyDay,
    ]
  );

  const recordAnswer = useCallback(
    async (correct: boolean) => {
      return updateProgress(
        (current) => ({
          total_answers:
            current.total_answers + 1,

          correct_answers:
            current.correct_answers +
            (correct ? 1 : 0),

          ...touchStudyDay(current),
        })
      );
    },
    [
      updateProgress,
      touchStudyDay,
    ]
  );

  const recordQuiz = useCallback(
    async ({
      xp,
      correctAnswers,
      totalAnswers,
    }: {
      xp: number;
      correctAnswers: number;
      totalAnswers: number;
    }) => {
      if (totalAnswers <= 0) {
        return false;
      }

      /*
       * Aqui está a principal correção:
       *
       * Os valores são calculados usando
       * o registro atual do Supabase,
       * e não apenas o "progress" que
       * estava armazenado no React.
       */
      return updateProgress(
        (current) => ({
          xp:
            current.xp +
            Math.max(0, xp),

          quizzes_completed:
            current.quizzes_completed + 1,

          correct_answers:
            current.correct_answers +
            Math.max(
              0,
              correctAnswers
            ),

          total_answers:
            current.total_answers +
            Math.max(
              0,
              totalAnswers
            ),

          ...touchStudyDay(current),
        })
      );
    },
    [
      updateProgress,
      touchStudyDay,
    ]
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        error,
        refreshProgress,
        addXp,
        recordAnswer,
        recordQuiz,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(
    ProgressContext
  );

  if (!value) {
    throw new Error(
      "useProgress deve ser usado dentro de ProgressProvider."
    );
  }

  return value;
}