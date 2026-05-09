import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff, Shield } from "lucide-react";
import { API_URL, authHeaders } from "../api";

export default function SettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (!form.currentPassword.trim()) return setError("أدخل كلمة المرور الحالية");
    if (!form.newPassword.trim()) return setError("أدخل كلمة المرور الجديدة");
    if (form.newPassword.length < 6) return setError("كلمة المرور الجديدة 6 أحرف على الأقل");
    if (form.newPassword !== form.confirmPassword) return setError("كلمة المرور الجديدة غير متطابقة");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-arabic focus:outline-none focus:border-neon/50 transition-all placeholder:text-cream/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-arabic neon-text">الإعدادات</h2>
        <p className="text-cream/40 text-sm mt-1">إدارة إعدادات الحساب والأمان</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-white/10"
        >
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="p-2.5 rounded-xl bg-neon/10 text-neon">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold font-arabic">تغيير كلمة المرور</h3>
              <p className="text-xs text-cream/40 font-arabic mt-0.5">يُنصح بتغييرها بشكل دوري للحفاظ على الأمان</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-xs text-cream/50 font-arabic mb-2">كلمة المرور الحالية *</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="أدخل كلمة المرور الحالية"
                  className={inputClass}
                />
                <button
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs text-cream/50 font-arabic mb-2">كلمة المرور الجديدة *</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="6 أحرف على الأقل"
                  className={inputClass}
                />
                <button
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-cream/50 font-arabic mb-2">تأكيد كلمة المرور الجديدة *</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  className={inputClass}
                />
                <button
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-red-400 text-xs font-arabic">
              ⚠️ {error}
            </motion.p>
          )}

          {/* Success */}
          {success && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 text-green-400 text-xs font-arabic">
              <CheckCircle2 size={14} />
              <span>تم تغيير كلمة المرور بنجاح!</span>
            </motion.div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 btn-neon w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="font-arabic">جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span className="font-arabic">تغيير كلمة المرور</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card border border-white/10 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="p-2.5 rounded-xl bg-white/5 text-cream/50">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-bold font-arabic">نصائح الأمان</h3>
              <p className="text-xs text-cream/40 font-arabic mt-0.5">احرص على حماية حسابك</p>
            </div>
          </div>

          {[
            "استخدم كلمة مرور تحتوي على أحرف وأرقام ورموز",
            "لا تشارك كلمة المرور مع أي شخص",
            "غيّر كلمة المرور كل 3 أشهر على الأقل",
            "تجنب استخدام نفس الكلمة في مواقع أخرى",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
              <span className="text-neon mt-0.5">✓</span>
              <p className="text-sm text-cream/60 font-arabic">{tip}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}