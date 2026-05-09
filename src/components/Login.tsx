import { useState } from "react";
import { motion } from "motion/react";
import { API_URL } from "../api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطأ في تسجيل الدخول");
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center" dir="rtl">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon/10 rounded-full blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-neon rounded-lg flex items-center justify-center">
            <span className="text-dark font-bold text-xl">F</span>
          </div>
          <h1 className="text-2xl font-bold neon-text font-arabic">فراغ</h1>
        </div>

        <h2 className="text-xl font-bold font-arabic mb-1">تسجيل الدخول</h2>
        <p className="text-cream/40 text-sm mb-8">أدخل بياناتك للوصول للوحة التحكم</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-cream/50 font-arabic mb-2 block">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon/50 transition-all"
              placeholder="admin@faragh.com"
            />
          </div>

          <div>
            <label className="text-xs text-cream/50 font-arabic mb-2 block">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-arabic">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-neon py-3 font-arabic text-base mt-2"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}