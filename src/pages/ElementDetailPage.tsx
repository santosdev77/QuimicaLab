import { useParams, useNavigate } from "react-router";
import { getElementById, CATEGORY_LABELS } from "../data/elements";
import AtomVisualizer from "../components/AtomVisualizer";

export default function ElementDetailPage() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const el = getElementById(Number(number));

  if (!el) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Elemento não encontrado
          </h1>

          <button
            onClick={() => navigate("/tabela")}
            className="text-blue-600 hover:underline"
          >
            Voltar à Tabela Periódica
          </button>
        </div>
      </div>
    );
  }

  const catClass = `cat-${el.category}`;

  const details = [
    {
      label: "Número Atômico",
      value: String(el.number),
      mono: true,
    },
    {
      label: "Massa Atômica",
      value: `${el.mass} u`,
      mono: true,
    },
    {
      label: "Grupo",
      value: el.period <= 7 ? String(el.group) : "—",
    },
    {
      label: "Período",
      value: el.period <= 7 ? String(el.period) : "—",
    },
    {
      label: "Categoria",
      value: CATEGORY_LABELS[el.category],
    },
    {
      label: "Estado Físico",
      value:
        el.state === "solid"
          ? "Sólido"
          : el.state === "liquid"
            ? "Líquido"
            : el.state === "gas"
              ? "Gasoso"
              : "Desconhecido",
    },

    ...(el.meltingPoint !== undefined
      ? [
          {
            label: "Ponto de Fusão",
            value: `${el.meltingPoint} °C`,
            mono: true,
          },
        ]
      : []),

    ...(el.boilingPoint !== undefined
      ? [
          {
            label: "Ponto de Ebulição",
            value: `${el.boilingPoint} °C`,
            mono: true,
          },
        ]
      : []),

    ...(el.electronegativity !== undefined
      ? [
          {
            label: "Eletronegatividade",
            value: String(el.electronegativity),
            mono: true,
          },
        ]
      : []),

    ...(el.density !== undefined
      ? [
          {
            label: "Densidade",
            value: `${el.density} g/cm³`,
            mono: true,
          },
        ]
      : []),

    ...(el.discoveredBy
      ? [
          {
            label: "Descoberto por",
            value: el.discoveredBy,
          },
        ]
      : []),

    ...(el.year
      ? [
          {
            label: "Ano",
            value: String(
              el.year === 0
                ? "Antiguidade"
                : el.year > 5000
                  ? "Pré-história"
                  : el.year,
            ),
          },
        ]
      : []),
  ];

  // Configuração eletrônica — distribuição por camadas
  const shellMap: Record<string, number> = {};

  const configStr = el.config.replace(/\[.*?\]\s*/, "");

  const subshellRegex = /(\d)([spdf])(\d+)/g;

  let match: RegExpExecArray | null;

  while ((match = subshellRegex.exec(configStr)) !== null) {
    const shell = match[1];
    const electrons = parseInt(match[3], 10);

    shellMap[shell] = (shellMap[shell] || 0) + electrons;
  }

  const shells = Object.entries(shellMap).sort(
    (a, b) => Number(a[0]) - Number(b[0]),
  );

  const dailyUses: Record<string, { icon: string; label: string }[]> = {
    Ferro: [{ icon: "PF", label: "Panelas" }, { icon: "CR", label: "Carros" }, { icon: "CT", label: "Construções" }],
    Carbono: [{ icon: "GR", label: "Grafite" }, { icon: "CB", label: "Combustíveis" }, { icon: "OV", label: "Organismos vivos" }],
    Silício: [{ icon: "PC", label: "Computadores" }, { icon: "VD", label: "Vidro" }, { icon: "CH", label: "Chips" }],
    Oxigênio: [{ icon: "AR", label: "Respiração" }, { icon: "AG", label: "Água" }, { icon: "HP", label: "Hospitais" }],
  };
  const everyday = dailyUses[el.name] ?? el.uses.slice(0, 3).map((label, index) => ({ icon: ["01", "02", "03"][index], label }));

  return (
    <div className="min-h-screen bg-white">

      {/* Voltar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          ← Voltar
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Aplicações reais</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Onde encontramos no dia a dia</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {everyday.map((item) => <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white bg-white p-4 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-xs font-extrabold text-blue-700">{item.icon}</span><span className="font-semibold text-slate-800">{item.label}</span></div>)}
          </div>
        </div>
      </section>

      {/* Hero */}
      <div
        className={`${catClass} mt-4`}
        style={{
          background: "var(--cat-bg)",
          borderBottom: "1px solid var(--cat-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div>

              <div className="flex items-baseline gap-4 mb-4">

                <span
                  className="text-8xl font-extrabold font-mono leading-none"
                  style={{ color: "var(--cat-text)" }}
                >
                  {el.symbol}
                </span>

                <span
                  className="text-4xl font-mono font-semibold"
                  style={{
                    color: "var(--cat-text)",
                    opacity: 0.6,
                  }}
                >
                  {el.number}
                </span>

              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {el.name}
              </h1>

              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4"
                style={{
                  background: "var(--cat-bg)",
                  borderColor: "var(--cat-border)",
                  color: "var(--cat-text)",
                }}
              >
                {CATEGORY_LABELS[el.category]}
              </div>

              <p className="text-slate-600 leading-relaxed">
                {el.description}
              </p>

              {/* Distribuição eletrônica */}
              {shells.length > 0 && (
                <div className="mt-5">

                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    Distribuição por camadas
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">

                    {shells.map(([shell, count], index) => (
                      <div
                        key={shell}
                        className="flex items-center gap-1.5"
                      >

                        <div
                          className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold font-mono"
                          style={{
                            background: "var(--cat-bg)",
                            borderColor: "var(--cat-border)",
                            color: "var(--cat-text)",
                          }}
                        >
                          {count}
                        </div>

                        {index < shells.length - 1 && (
                          <div className="h-px w-4 bg-slate-300" />
                        )}

                      </div>
                    ))}

                  </div>

                  <div className="mt-2 text-xs font-mono text-slate-500">
                    {el.config}
                  </div>

                </div>
              )}

            </div>

            {/* Átomo animado */}
            <div className="flex justify-center">
              <AtomVisualizer
                size={220}
                protons={el.number}
                electrons={el.number}
                animated
              />
            </div>

          </div>

        </div>
      </div>

      {/* Informações */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">

          {details.map((d) => (
            <div
              key={d.label}
              className="bg-slate-50 rounded-xl p-4 border border-slate-100"
            >

              <div className="text-xs text-slate-500 mb-1">
                {d.label}
              </div>

              <div
                className={`text-slate-900 font-semibold ${
                  d.mono ? "font-mono" : ""
                }`}
              >
                {d.value}
              </div>

            </div>
          ))}

        </div>

        {/* Aplicações e curiosidade */}
        <div className="grid lg:grid-cols-2 gap-8">

          <div>

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Aplicações no Cotidiano
            </h2>

            <ul className="space-y-2">

              {el.uses.map((use) => (
                <li
                  key={use}
                  className="flex items-start gap-3"
                >

                  <div
                    className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: "var(--cat-text)",
                    }}
                  />

                  <span className="text-slate-600 text-sm">
                    {use}
                  </span>

                </li>
              ))}

            </ul>

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Curiosidade
            </h2>

            <div
              className={`${catClass} p-5 rounded-2xl border`}
              style={{
                background: "var(--cat-bg)",
                borderColor: "var(--cat-border)",
              }}
            >

              <div className="text-2xl mb-3">
                💡
              </div>

              <p className="text-slate-700 leading-relaxed text-sm">
                {el.funFact}
              </p>

            </div>

          </div>

        </div>

        {/* Navegação entre elementos */}
        <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">

          {el.number > 1 ? (
            <button
              onClick={() =>
                navigate(`/elemento/${el.number - 1}`)
              }
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              ← Elemento {el.number - 1}
            </button>
          ) : (
            <div />
          )}

          {el.number < 118 ? (
            <button
              onClick={() =>
                navigate(`/elemento/${el.number + 1}`)
              }
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Elemento {el.number + 1} →
            </button>
          ) : (
            <div />
          )}

        </div>

      </div>
    </div>
  );
}
