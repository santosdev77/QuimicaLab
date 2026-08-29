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
import ChemistryCalculatorPage from "../pages/ChemistryCalculatorPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import { ForgotPasswordPage, LoginPage, RegisterPage } from "../pages/AuthPages";
import SpectroscopyPage from "../pages/SpectroscopyPage";
import DrugDecoderPage from "../pages/DrugDecoderPage";
import VirtualLabPage from "../pages/VirtualLabPage";
import ChemistryMapPage from "../pages/ChemistryMapPage";

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
      { path: "conquistas", Component: DashboardPage },
      { path: "calculadora", Component: ChemistryCalculatorPage },
      { path: "medicamentos", Component: DrugDecoderPage },
      { path: "espectroscopia", Component: SpectroscopyPage },
      { path: "lab-virtual", Component: VirtualLabPage },
      { path: "quimica-do-mapa", Component: ChemistryMapPage },
      { path: "login", Component: LoginPage },
      { path: "cadastro", Component: RegisterPage },
      { path: "esqueci-senha", Component: ForgotPasswordPage },
      { Component: ProtectedRoute, children: [
        { path: "dashboard", Component: DashboardPage },
        { path: "perfil", Component: ProfilePage },
      ] },
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
