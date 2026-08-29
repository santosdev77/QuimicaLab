import { useState } from "react";

type Reagent = {
  name: string;
  color: string;
  reaction: string;
  explanation: string;
};

const reagents: Reagent[] = [
  {
    name: "Água",
    color: "#dbeafe",
    reaction: "Solução aquosa",
    explanation:
      "A água atua como solvente e permite a dissolução e dispersão das substâncias.",
  },
  {
    name: "Permanganato",
    color: "#7e22ce",
    reaction: "Solução violeta de KMnO₄",
    explanation:
      "O íon permanganato apresenta uma coloração violeta intensa em solução aquosa.",
  },
  {
    name: "Ácido",
    color: "#f8fafc",
    reaction: "Meio ácido",
    explanation:
      "Ácidos aumentam a concentração de íons H⁺ em solução aquosa. Nesta simulação, o ácido utilizado é representado como uma solução incolor.",
  },
  {
    name: "Base",
    color: "#f8fafc",
    reaction: "Meio básico",
    explanation:
      "Bases aumentam a concentração de íons OH⁻ em solução aquosa. Nesta simulação, a base utilizada é representada como uma solução incolor.",
  },
  {
    name: "Sulfato de cobre",
    color: "#0ea5e9",
    reaction: "Solução azul de CuSO₄",
    explanation:
      "Os íons Cu²⁺ hidratados presentes na solução são responsáveis pela coloração azul característica.",
  },
];

export default function VirtualLabPage() {
  const [selected, setSelected] = useState<Reagent[]>([]);

  const mix = (reagent: Reagent) => {
    setSelected((current) => {
      if (current.some((item) => item.name === reagent.name)) {
        return current;
      }

      return [...current, reagent].slice(-3);
    });
  };

  const has = (name: string) =>
    selected.some((item) => item.name === name);

  const hasWater = has("Água");
  const hasPermanganate = has("Permanganato");
  const hasCopper = has("Sulfato de cobre");
  const hasAcid = has("Ácido");
  const hasBase = has("Base");

  const neutral = hasAcid && hasBase;

  /*
    DEFINIÇÃO DA COR DA SOLUÇÃO
  */

  let liquidColor = "#e0f2fe";
  let liquidName = "incolor";
  let reactionTitle = "Bancada pronta";
  let explanation =
    "Escolha reagentes abaixo e adicione-os ao béquer para observar a simulação.";

  if (selected.length > 0) {
    reactionTitle =
      selected[selected.length - 1].reaction;

    explanation =
      selected[selected.length - 1].explanation;
  }

  /*
    ÁCIDO + BASE
  */

  if (neutral) {
    liquidColor = "#f8fafc";
    liquidName = "incolor";

    reactionTitle = "Neutralização";

    explanation =
      "A combinação de uma solução ácida com uma solução básica pode provocar uma reação de neutralização, formando água e um sal. Nesta simulação não há formação de gás.";
  }

  /*
    PERMANGANATO
  */

  else if (hasPermanganate && hasWater) {
    liquidColor = "#a855f7";
    liquidName = "violeta diluído";

    reactionTitle =
      "Permanganato dissolvido em água";

    explanation =
      "O permanganato se dispersa na água, produzindo uma solução violeta. A intensidade da cor depende da concentração.";
  }

  else if (hasPermanganate) {
    liquidColor = "#7e22ce";
    liquidName = "violeta";

    reactionTitle =
      "Solução de permanganato";

    explanation =
      "O íon permanganato apresenta coloração violeta intensa em solução.";
  }

  /*
    SULFATO DE COBRE
  */

  else if (hasCopper && hasWater) {
    liquidColor = "#38bdf8";
    liquidName = "azul diluído";

    reactionTitle =
      "Sulfato de cobre dissolvido";

    explanation =
      "Os íons Cu²⁺ se dispersam na água e produzem uma solução azul. A tonalidade depende da concentração.";
  }

  else if (hasCopper) {
    liquidColor = "#0284c7";
    liquidName = "azul";

    reactionTitle =
      "Solução de sulfato de cobre";

    explanation =
      "Os íons Cu²⁺ hidratados são responsáveis pela coloração azul característica da solução.";
  }

  /*
    ÁGUA
  */

  else if (hasWater) {
    liquidColor = "#dff4ff";
    liquidName = "incolor";

    reactionTitle =
      "Solução aquosa";

    explanation =
      "A água é visualmente incolor e atua como solvente para outras substâncias adicionadas ao sistema.";
  }

  /*
    ÁCIDO OU BASE ISOLADOS
  */

  else if (hasAcid) {
    liquidColor = "#f8fafc";
    liquidName = "incolor";

    reactionTitle =
      "Meio ácido";

    explanation =
      "A solução ácida é representada visualmente como incolor. A acidez é determinada pela concentração de íons H⁺.";
  }

  else if (hasBase) {
    liquidColor = "#f8fafc";
    liquidName = "incolor";

    reactionTitle =
      "Meio básico";

    explanation =
      "A solução básica é representada visualmente como incolor. A basicidade está relacionada à presença de íons OH⁻.";
  }

  /*
    MISTURA PERMANGANATO + SULFATO DE COBRE
  */

  if (
    hasPermanganate &&
    hasCopper &&
    !neutral
  ) {
    liquidColor = "#6366f1";
    liquidName = "azul-violeta";

    reactionTitle =
      "Mistura de soluções coloridas";

    explanation =
      "A presença simultânea de espécies coloridas produz visualmente uma solução com tonalidade intermediária entre azul e violeta.";
  }

  const solutionHeight =
    selected.length === 0
      ? "15%"
      : selected.length === 1
      ? "45%"
      : selected.length === 2
      ? "58%"
      : "70%";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          Ambiente interativo
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
          Laboratório virtual avançado
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Monte misturas visuais com reagentes didáticos.
          As animações representam observações qualitativas
          em um ambiente seguro.
        </p>

        <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr_330px]">

          {/* REAGENTES */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <h2 className="font-bold text-slate-900 dark:text-white">
              Reagentes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Clique para adicionar ao béquer.
            </p>

            <div className="mt-5 space-y-2">

              {reagents.map((reagent) => (
                <button
                  key={reagent.name}
                  onClick={() => mix(reagent)}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <span
                    className="h-8 w-8 rounded-full border border-white shadow-sm"
                    style={{
                      backgroundColor: reagent.color,
                    }}
                  />

                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {reagent.name}
                  </span>

                </button>
              ))}

            </div>

            <button
              onClick={() => setSelected([])}
              className="mt-5 w-full rounded-lg border border-slate-200 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Limpar bancada
            </button>

          </section>

          {/* ÁREA EXPERIMENTAL */}

          <section className="relative min-h-[480px] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-blue-950 p-6 shadow-sm">

            <div className="absolute left-7 top-7 flex gap-3 text-xs font-bold text-blue-100">

              <span className="rounded bg-white/10 px-3 py-1.5">
                Tubo de ensaio
              </span>

              <span className="rounded bg-white/10 px-3 py-1.5">
                Pipeta
              </span>

              <span className="rounded bg-white/10 px-3 py-1.5">
                Béquer
              </span>

            </div>

            {/* BÉQUER */}

            <div className="absolute bottom-10 left-1/2 w-56 -translate-x-1/2">

              <div
                className="
                  relative mx-auto h-64 w-44
                  overflow-hidden
                  rounded-b-[45px]
                  border-x-4
                  border-b-4
                  border-white/80
                  bg-white/5
                "
              >

                {/* LÍQUIDO */}

                <div
                  className="
                    absolute inset-x-0 bottom-0
                    transition-all
                    duration-700
                    ease-in-out
                  "
                  style={{
                    height: solutionHeight,
                    backgroundColor: liquidColor,
                  }}
                >

                  {/* REFLEXO DO LÍQUIDO */}

                  <div className="absolute inset-x-0 top-2 h-2 bg-white/30" />

                  {/* EFEITO DE MISTURA */}

                  {selected.length > 1 && (
                    <>
                      <div
                        className="
                          absolute
                          left-0
                          right-0
                          top-1/2
                          h-1
                          animate-pulse
                          bg-white/30
                        "
                      />

                      <div
                        className="
                          absolute
                          left-1/4
                          top-1/3
                          h-3
                          w-3
                          animate-ping
                          rounded-full
                          bg-white/30
                        "
                      />

                      <div
                        className="
                          absolute
                          right-1/4
                          bottom-1/3
                          h-2
                          w-2
                          animate-ping
                          rounded-full
                          bg-white/40
                        "
                      />
                    </>
                  )}

                </div>

              </div>

              <div className="mx-auto h-4 w-52 rounded-full bg-slate-950/50" />

            </div>

            <p className="absolute bottom-4 left-0 right-0 text-center text-xs font-semibold text-blue-100">

              {selected.length
                ? selected
                    .map((item) => item.name)
                    .join(" + ")
                : "Aguardando reagentes"}

            </p>

          </section>

          {/* OBSERVAÇÕES */}

          <aside className="rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-slate-700 dark:bg-slate-900">

            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Observação
            </p>

            <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
              {reactionTitle}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {explanation}
            </p>

            <div className="mt-6 border-t border-blue-200 pt-4 dark:border-slate-700">

              <p className="text-xs font-bold text-slate-500">
                ALTERAÇÕES VISUAIS
              </p>

              <ul className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">

                <li className="flex justify-between gap-4">
                  <span>Cor da solução:</span>

                  <b className="capitalize">
                    {liquidName}
                  </b>
                </li>

                <li className="flex justify-between gap-4">
                  <span>Precipitado:</span>

                  <b>
                    não observado
                  </b>
                </li>

                <li className="flex justify-between gap-4">
                  <span>Formação de gás:</span>

                  <b>
                    não observada
                  </b>
                </li>

                <li className="flex justify-between gap-4">
                  <span>Reagentes:</span>

                  <b>
                    {selected.length}
                  </b>
                </li>

              </ul>

            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}