import { createBrowserRouter } from "react-router";
import Root from "./Root";
import HomePage from "../pages/HomePage";
import PeriodicTablePage from "../pages/PeriodicTablePage";
import ElementDetailPage from "../pages/ElementDetailPage";
import LearnPage from "../pages/LearnPage";
import LabPage from "../pages/LabPage";
import QuizPage from "../pages/QuizPage";
import ProfilePage from "../pages/ProfilePage";
import DashboardPage from "../pages/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "tabela", Component: PeriodicTablePage },
      { path: "elemento/:number", Component: ElementDetailPage },
      { path: "aprender", Component: LearnPage },
      { path: "laboratorio", Component: LabPage },
      { path: "desafios", Component: QuizPage },
      { path: "perfil", Component: ProfilePage },
      { path: "conquistas", Component: DashboardPage },
      { path: "*", Component: () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚗️</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Página não encontrada</h1>
            <a href="/" className="text-blue-600 hover:underline">Voltar ao início</a>
          </div>
        </div>
      )},
    ],
  },
]);
