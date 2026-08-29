import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Band = { position: number; width: number; intensity: number; name: string; group: string; interpretation: string };
type Compound = { label: string; formula: string; bands: Band[]; uv: number; nmr: { shift: number; intensity: number; label: string }[] };

const compounds: Compound[] = [
  { label: "Água", formula: "H2O", uv: 190, bands: [{ position: 3400, width: 260, intensity: 52, name: "O-H", group: "Hidroxila", interpretation: "Estiramento O-H amplo devido a ligações de hidrogênio." }], nmr: [{ shift: 4.8, intensity: 85, label: "H ligado a O" }] },
  { label: "Etanol", formula: "CH3CH2OH", uv: 205, bands: [{ position: 3350, width: 300, intensity: 55, name: "O-H", group: "Álcool", interpretation: "Banda larga característica do estiramento O-H." }, { position: 1050, width: 80, intensity: 38, name: "C-O", group: "Álcool", interpretation: "Estiramento simples C-O da função álcool." }], nmr: [{ shift: 1.2, intensity: 55, label: "CH3" }, { shift: 3.7, intensity: 46, label: "CH2-O" }, { shift: 2.4, intensity: 20, label: "OH" }] },
  { label: "Benzeno", formula: "C6H6", uv: 255, bands: [{ position: 1600, width: 60, intensity: 47, name: "C=C", group: "Anel aromático", interpretation: "Vibração do esqueleto C=C do anel aromático." }, { position: 1500, width: 55, intensity: 38, name: "C=C", group: "Anel aromático", interpretation: "Segunda banda típica do sistema aromático conjugado." }, { position: 3030, width: 70, intensity: 28, name: "C-H sp²", group: "Aromático", interpretation: "Estiramento C-H de carbonos sp²." }], nmr: [{ shift: 7.3, intensity: 90, label: "H aromáticos" }] },
  { label: "Ácido acético", formula: "CH3COOH", uv: 210, bands: [{ position: 1710, width: 65, intensity: 75, name: "C=O", group: "Carbonila", interpretation: "Estiramento intenso da carbonila de ácido carboxílico." }, { position: 3000, width: 450, intensity: 40, name: "O-H", group: "Ácido carboxílico", interpretation: "O-H muito amplo, geralmente entre 2500 e 3300 cm⁻¹." }], nmr: [{ shift: 2.1, intensity: 65, label: "CH3-CO" }, { shift: 11.3, intensity: 25, label: "COOH" }] },
];

function irData(bands: Band[]) {
  return Array.from({ length: 176 }, (_, index) => {
    const wavenumber = 4000 - index * 20;
    const absorption = bands.reduce((total, band) => total + band.intensity * Math.exp(-((wavenumber - band.position) ** 2) / (2 * band.width ** 2)), 0);
    return { wavenumber, transmittance: Math.max(8, 93 - absorption) };
  });
}

export default function SpectroscopyPage() {
  const [formula, setFormula] = useState("CH3CH2OH");
  const [structure, setStructure] = useState("Álcool primário");
  const [smiles, setSmiles] = useState("CCO");
  const [activeBand, setActiveBand] = useState<Band | null>(compounds[1].bands[0]);
  const compound = useMemo(() => compounds.find((item) => item.formula.toLowerCase() === formula.replaceAll(" ", "").toLowerCase()) ?? compounds[1], [formula]);
  const chartData = useMemo(() => irData(compound.bands), [compound]);
  const simulate = () => setActiveBand(compound.bands[0] ?? null);

  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="mb-8"><p className="text-sm font-bold uppercase tracking-wide text-blue-600">Análise instrumental</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">Simulador de espectroscopia</h1><p className="mt-2 max-w-2xl text-slate-500">Explore assinaturas espectrais educativas de compostos comuns. Os resultados são uma simulação qualitativa.</p></div>
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="text-sm font-semibold text-slate-700">Fórmula molecular<input value={formula} onChange={(event) => setFormula(event.target.value)} placeholder="Ex.: CH3CH2OH" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-blue-500" /></label>
      <label className="text-sm font-semibold text-slate-700">Estrutura simplificada<input value={structure} onChange={(event) => setStructure(event.target.value)} placeholder="Ex.: álcool" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" /></label>
      <label className="text-sm font-semibold text-slate-700">SMILES <span className="font-normal text-slate-400">opcional</span><input value={smiles} onChange={(event) => setSmiles(event.target.value)} placeholder="Ex.: CCO" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-blue-500" /></label>
      <button onClick={simulate} className="self-end rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700">Gerar espectros</button>
    </section>
    <p className="mt-3 text-xs text-slate-500">Reconhecidos nesta demonstração: H2O, CH3CH2OH, C6H6 e CH3COOH. Entrada atual: {compound.label}.</p>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex flex-wrap items-baseline justify-between gap-2"><div><h2 className="font-bold text-slate-900">Espectro IR</h2><p className="text-sm text-slate-500">Transmitância simulada, 4000 a 500 cm⁻¹</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Infravermelho</span></div><div className="h-72"><ResponsiveContainer><AreaChart data={chartData} onClick={(state) => { const position = state?.activeLabel; if (typeof position === "number") setActiveBand(compound.bands.reduce((closest, band) => Math.abs(band.position - position) < Math.abs(closest.position - position) ? band : closest)); }}><defs><linearGradient id="irFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={.3}/><stop offset="100%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/><XAxis dataKey="wavenumber" reversed tick={{ fontSize: 11 }}/><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%"/><Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, "Transmitância"]} labelFormatter={(label) => `${label} cm⁻¹`}/><Area type="monotone" dataKey="transmittance" stroke="#2563eb" strokeWidth={2} fill="url(#irFill)" /></AreaChart></ResponsiveContainer></div><div className="mt-4 flex flex-wrap gap-2">{compound.bands.map((band) => <button key={`${band.name}-${band.position}`} onClick={() => setActiveBand(band)} className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-left text-xs text-blue-800 hover:border-blue-300"><b>{band.position} cm⁻¹</b> · {band.name}</button>)}</div></section>
        <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">UV-Vis simplificado</h2><p className="mt-1 text-sm text-slate-500">Absorção eletrônica prevista.</p><div className="mt-4 h-48"><ResponsiveContainer><LineChart data={Array.from({ length: 26 }, (_, i) => { const wavelength = 180 + i * 10; return { wavelength, absorbance: +(Math.exp(-((wavelength - compound.uv) ** 2) / 500) * 0.9).toFixed(2) }; })}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="wavelength" tick={{ fontSize: 10 }}/><YAxis tick={{ fontSize: 10 }}/><Tooltip/><Line type="monotone" dataKey="absorbance" stroke="#0d9488" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div><p className="text-sm text-teal-700">λmax aproximado: <b>{compound.uv} nm</b></p></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">RMN de 1H simplificado</h2><p className="mt-1 text-sm text-slate-500">Deslocamentos químicos estimados.</p><div className="mt-4 h-48"><ResponsiveContainer><LineChart data={Array.from({ length: 121 }, (_, i) => { const shift = +(12 - i * .1).toFixed(1); return { shift, signal: compound.nmr.reduce((sum, peak) => sum + peak.intensity * Math.exp(-((shift - peak.shift) ** 2) / .012), 0) }; })}><XAxis dataKey="shift" reversed tick={{ fontSize: 10 }} unit=" ppm"/><YAxis hide/><Tooltip labelFormatter={(label) => `${label} ppm`}/><Line type="monotone" dataKey="signal" stroke="#7c3aed" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div></section></div>
      </div>
      <aside className="h-fit rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Pico selecionado</p>{activeBand ? <><h2 className="mt-2 text-xl font-extrabold text-slate-900">{activeBand.name}</h2><p className="mt-1 font-mono text-sm text-blue-700">{activeBand.position} cm⁻¹</p><div className="mt-5 border-t border-blue-200 pt-4"><p className="text-xs font-bold text-slate-500">GRUPO FUNCIONAL</p><p className="mt-1 font-semibold text-slate-900">{activeBand.group}</p><p className="mt-4 text-sm leading-relaxed text-slate-600">{activeBand.interpretation}</p></div></> : <p className="mt-3 text-sm text-slate-500">Clique em uma banda para interpretar o sinal.</p>}</aside>
    </div>
  </div></div>;
}
