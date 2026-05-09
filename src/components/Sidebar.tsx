import { motion } from "motion/react";
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, Globe, UserRound } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "الرئيسية",      labelEn: "Dashboard" },
  { id: "studio",    icon: Globe,           label: "استوديو الموقع", labelEn: "Website Studio" },
  { id: "projects",  icon: Briefcase,       label: "المشاريع",       labelEn: "Projects" },
  { id: "team",      icon: UserRound,       label: "أعضاء الفريق",   labelEn: "Team Members" },
  { id: "settings",  icon: Settings,        label: "الإعدادات",      labelEn: "Settings" },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-72 h-screen glass border-l border-white/10 flex flex-col p-6 fixed right-0 top-0 z-50">
      <div className="mb-12 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-neon rounded-lg flex items-center justify-center neon-glow">
          <span className="text-dark font-bold text-xl">F</span>
        </div>
        <h1 className="text-2xl font-bold tracking-wider neon-text font-arabic">فراغ</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
              activeTab === item.id
                ? "bg-neon/10 text-neon border border-neon/30"
                : "text-cream/50 hover:bg-white/5 hover:text-cream"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              activeTab === item.id ? "text-neon" : "text-white/40"
            )} />
            <div className="flex flex-col items-start leading-tight">
              <span className="font-arabic font-medium">{item.label}</span>
              <span className="text-[10px] opacity-50 uppercase tracking-widest font-sans">{item.labelEn}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <button
          onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}
          className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-arabic">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}