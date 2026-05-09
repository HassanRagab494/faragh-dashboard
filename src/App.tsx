import { useState } from "react";
import Sidebar from "./components/Sidebar";
import StatsGrid from "./components/StatsGrid";
import PortfolioManager from "./components/PortfolioManager";
import WebsiteStudio from "./components/WebsiteStudio";
import TeamManager from "./components/TeamManager";
import SettingsPage from "./components/SettingsPage";
import { motion, AnimatePresence } from "motion/react";
import Login from "./components/Login";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-dark text-cream relative font-sans" dir="rtl">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mr-72 p-8 pt-6 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-arabic mb-1">
              أهلاً بك في <span className="neon-text">فراغ</span>
            </h1>
            <p className="text-cream/40 text-sm">نظرة عامة على أداء الوكالة والنمو الرقمي.</p>
          </div>

         
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <StatsGrid />
            </motion.div>
          )}

          {activeTab === "studio" && (
            <motion.div key="studio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <WebsiteStudio />
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PortfolioManager />
            </motion.div>
          )}

      

          {activeTab === "team" && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <TeamManager />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SettingsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}