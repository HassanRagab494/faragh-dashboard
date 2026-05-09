import { motion } from "motion/react";
import { Users, FolderKanban, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL, authHeaders } from "../api";

interface Stats {
  totalProjects: number;
  clientSatisfaction: number;
  teamCount: number;
}

export default function StatsGrid() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    clientSatisfaction: 0,
    teamCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/stats`, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const statCards = [
    { label: "المشاريع المنفذة", value: stats.totalProjects, icon: FolderKanban, color: "text-neon" },
    { label: "رضا العملاء", value: `${stats.clientSatisfaction}%`, icon: Star, color: "text-yellow-400" },
    { label: "أعضاء الفريق", value: stats.teamCount, icon: Users, color: "text-teal" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card flex items-center justify-center h-32">
            <Loader2 className="animate-spin text-neon" size={24} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card flex items-center justify-center h-32 mb-8">
        <p className="text-red-400 font-arabic text-sm">⚠️ فشل في تحميل الإحصائيات</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card hover:border-white/20 transition-all group overflow-hidden relative"
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <stat.icon size={80} />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-cream/50 text-sm font-arabic">{stat.label}</h3>
            <p className="text-3xl font-bold font-sans tracking-tighter">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}