import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const signOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  const navItems = [
    { to: "/", label: "Início" },
    { to: "/tabela", label: "Tabela Periódica" },
    { to: "/aprender", label: "Aprenda" },
    { to: "/laboratorio", label: "Laboratório" },
    { to: "/calculadora", label: "Calculadora" },
    { to: "/desafios", label: "Desafios" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-current stroke-2">
                <circle cx="12" cy="12" r="3" />
                <ellipse cx="12" cy="12" rx="10" ry="4.5" />
                <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Química<span className="text-blue-600">Lab</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Começar a estudar
            </button>

            {/* Avatar */}
            <button
              onClick={() => navigate(user ? "/perfil" : "/cadastro")}
              className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600 fill-current">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </button>
            {user && (
              <button onClick={() => void signOut()} className="hidden lg:block text-sm font-semibold text-slate-500 hover:text-red-600">
                Sair
              </button>
            )}

            {/* Mobile burger */}
            <button
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2"><path d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 flex flex-col gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {!user && <button onClick={() => { setMenuOpen(false); navigate("/cadastro"); }} className="px-4 py-2 text-left text-sm font-semibold text-blue-600">Criar conta</button>}
            {user && <button onClick={() => { setMenuOpen(false); void signOut(); }} className="px-4 py-2 text-left text-sm font-semibold text-red-600">Sair</button>}
            <button
              onClick={() => { setMenuOpen(false); navigate("/aprender"); }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg"
            >
              Começar a estudar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
