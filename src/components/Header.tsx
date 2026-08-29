import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabase";
import ThemeToggle from "./ThemeToggle";

type NavigationItem = { to: string; label: string };

const primaryItems: NavigationItem[] = [
  { to: "/", label: "Início" }, { to: "/tabela", label: "Tabela Periódica" }, { to: "/aprender", label: "Aprenda" }, { to: "/laboratorio", label: "Laboratório" }, { to: "/calculadora", label: "Calculadora" },
];
const exploreItems: NavigationItem[] = [
  { to: "/espectroscopia", label: "Espectroscopia" }, { to: "/lab-virtual", label: "Lab virtual" }, { to: "/quimica-do-mapa", label: "Química do mapa" }, { to: "/medicamentos", label: "Medicamentos" }, { to: "/desafios", label: "Desafios" }, { to: "/conquistas", label: "Conquistas" },
];

const fullMenuItems: NavigationItem[] = [
  { to: "/", label: "Início" }, { to: "/tabela", label: "Tabela Periódica" }, { to: "/aprender", label: "Aprenda" }, { to: "/laboratorio", label: "Laboratório" }, { to: "/calculadora", label: "Calculadora" }, { to: "/espectroscopia", label: "Espectroscopia" }, { to: "/quimica-do-mapa", label: "Química do mapa" }, { to: "/desafios", label: "Desafios" }, { to: "/conquistas", label: "Conquistas" },
];

function MenuIcon({ path }: { path: string }) {
  const shared = "h-4 w-4 fill-none stroke-current stroke-2";
  if (path === "/") return <svg viewBox="0 0 24 24" className={shared}><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z" /></svg>;
  if (path === "/tabela") return <svg viewBox="0 0 24 24" className={shared}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></svg>;
  if (path === "/aprender") return <svg viewBox="0 0 24 24" className={shared}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21zM20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5A2.5 2.5 0 0 1 20 21z" /></svg>;
  if (path === "/laboratorio") return <svg viewBox="0 0 24 24" className={shared}><path d="M9 3h6M10 3v6l-5 8a3 3 0 0 0 2.6 4h8.8a3 3 0 0 0 2.6-4l-5-8V3M8 14h8" /></svg>;
  if (path === "/calculadora") return <svg viewBox="0 0 24 24" className={shared}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" /></svg>;
  if (path === "/espectroscopia") return <svg viewBox="0 0 24 24" className={shared}><path d="M3 12h3l2-6 4 12 3-8 2 2h4" /></svg>;
  if (path === "/quimica-do-mapa") return <svg viewBox="0 0 24 24" className={shared}><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z" /><circle cx="12" cy="9" r="2" /></svg>;
  return <svg viewBox="0 0 24 24" className={shared}><path d="M7 4h10v4a5 5 0 0 1-10 0zM9 20h6M12 13v7M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" /></svg>;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const signOut = async () => { await supabase.auth.signOut(); navigate("/"); };
  const exploreActive = exploreItems.some((item) => location.pathname === item.to);
  const linkClass = (isActive: boolean) => `rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`;

  return <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95"><div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
    <div className="flex h-16 items-center gap-3 2xl:h-24">
      <button onClick={() => navigate("/")} className="group flex shrink-0 items-center gap-2.5" aria-label="Ir para o início"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm transition-colors group-hover:bg-blue-700"><svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2 text-white"><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="10" ry="4.5" /><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" /></svg></div><span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-white">Química<span className="text-blue-600">Lab</span></span></button>
      <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex 2xl:hidden" aria-label="Navegação principal">{primaryItems.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => linkClass(isActive)}>{item.label}</NavLink>)}<div className="relative"><button onClick={() => setExploreOpen((open) => !open)} aria-expanded={exploreOpen} className={`flex items-center gap-1 ${linkClass(exploreActive)}`}>Explorar<svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 fill-none stroke-current stroke-2 transition-transform ${exploreOpen ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg></button>{exploreOpen && <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">{exploreItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setExploreOpen(false)} className={({ isActive }) => `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`}>{item.label}</NavLink>)}</div>}</div></nav>
      <nav className="hidden min-w-0 flex-1 items-stretch justify-center gap-1 2xl:flex" aria-label="Navegação principal">{fullMenuItems.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `flex min-w-[68px] flex-col items-center gap-1 border-b-2 px-2 pt-2 text-xs font-medium transition-colors ${isActive ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-blue-600 dark:text-slate-400"}`}><MenuIcon path={item.to} /><span className="whitespace-nowrap">{item.label}</span></NavLink>)}</nav>
      <div className="ml-auto flex shrink-0 items-center gap-2"><ThemeToggle /><button onClick={() => navigate(user ? "/dashboard" : "/login")} className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 xl:flex">Começar a estudar</button><button onClick={() => navigate(user ? "/perfil" : "/cadastro")} aria-label={user ? "Abrir perfil" : "Criar conta"} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 transition-colors hover:bg-blue-200"><svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-blue-600"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg></button>{user && <button onClick={() => void signOut()} className="hidden text-sm font-semibold text-slate-500 hover:text-red-600 2xl:block">Sair</button>}<button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menu">{menuOpen ? <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2"><path d="M6 18 18 6M6 6l12 12" /></svg> : <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>}</button></div>
    </div>
    <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 py-2 lg:hidden dark:border-slate-800" aria-label="Atalhos de navegação">{[...primaryItems, ...exploreItems].map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "text-slate-600 dark:text-slate-300"}`}>{item.label}</NavLink>)}</nav>
    {menuOpen && <nav className="border-t border-slate-100 py-3 lg:hidden dark:border-slate-800" aria-label="Navegação móvel">{[...primaryItems, ...exploreItems].map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={() => setMenuOpen(false)} className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`}>{item.label}</NavLink>)}<button onClick={() => { setMenuOpen(false); navigate(user ? "/dashboard" : "/login"); }} className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-left text-sm font-semibold text-white">Começar a estudar</button>{user && <button onClick={() => { setMenuOpen(false); void signOut(); }} className="mt-1 w-full rounded-lg px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Sair</button>}</nav>}
  </div></header>;
}
