import { motion } from "motion/react";
import { Users, FolderKanban, Star, Eye, TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL, authHeaders } from "../api";

interface Stats {
  totalProjects: number;
  clientSatisfaction: number;
  teamCount: number;
}

interface Analytics {
  realtime: number;
  daily: number;
  weekly: number;
  monthly: number;
}

export default function StatsGrid() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    clientSatisfaction: 0,
    teamCount: 0,
  });
  const [analytics, setAnalytics] = useState<Analytics>({
    realtime: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/stats`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/analytics`, { headers: authHeaders() }).then(r => r.json()),
    ])
      .then(([statsData, analyticsData]) => {
        setStats(statsData);
        setAnalytics(analyticsData);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // ✅ بيحدث الـ realtime كل 30 ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/analytics`, { headers: authHeaders() })
        .then(r => r.json())
        .then(data => setAnalytics(data))
        .catch(() => {});
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: "المشاريع المنفذة", value: stats.totalProjects,         icon: FolderKanban, color: "text-neon"        },
    { label: "رضا العملاء",      value: `${stats.clientSatisfaction}%`, icon: Star,      color: "text-yellow-400"  },
    { label: "أعضاء الفريق",     value: stats.teamCount,              icon: Users,        color: "text-teal"        },
    { label: "زوار اليوم",       value: analytics.daily,              icon: Eye,          color: "text-blue-400"    },
    { label: "زوار الشهر",       value: analytics.monthly,            icon: TrendingUp,   color: "text-purple-400"  },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(5)].map((_, i) => (
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
    <div className="space-y-4 mb-8">

      {/* ✅ الكارت الكبير — الزوار دلوقتي */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card hover:border-white/20 transition-all group overflow-hidden relative flex items-center gap-6"
      >
        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Eye size={100} />
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-green-400">
          <Eye size={28} />
        </div>
        <div>
          <h3 className="text-cream/50 text-sm font-arabic mb-1">زوار دلوقتي (آخر 5 دقايق)</h3>
          <div className="flex items-center gap-3">
            <p className="text-4xl font-bold font-sans tracking-tighter">{analytics.realtime}</p>
            {/* نقطة خضرا بتنبض تدل على real-time */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* ✅ باقي الكروت */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

    </div>
  );
}