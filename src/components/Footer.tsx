import { useNavigate } from "react-router";

export default function Footer() {
  const navigate = useNavigate();

  const links = [
    { label: "Sobre o projeto", to: "/" },
    { label: "Conteúdos", to: "/aprender" },
    { label: "Tabela Periódica", to: "/tabela" },
    { label: "Contato", to: "/" },
    { label: "Política de privacidade", to: "/" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-current stroke-2">
                  <circle cx="12" cy="12" r="3" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.5" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Química<span className="text-blue-400">Lab</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Plataforma educacional interativa para estudantes do Ensino Médio aprenderem Química de forma moderna e dinâmica.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Links</h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.to)}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">QuímicaLab em números</h4>
            <div className="space-y-3">
              {[
                ["118", "Elementos na tabela"],
                ["12", "Módulos de aprendizado"],
                ["50+", "Questões no banco de quiz"],
                ["3", "Experimentos virtuais"],
              ].map(([num, label]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-blue-400 font-bold font-mono text-base w-12">{num}</span>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">© 2025 QuímicaLab. Todos os direitos reservados.</p>
          <p className="text-xs">Feito com ❤️ para estudantes de Química</p>
        </div>
      </div>
    </footer>
  );
}
