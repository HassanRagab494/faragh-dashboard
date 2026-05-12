import { motion, AnimatePresence } from "motion/react";
import { UserPlus, Shield, Star, Coffee, MoreHorizontal, Trash2, X, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import { API_URL, authHeaders } from "../api";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  status: string;
}

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", avatar: "", description: "", status: "Active" }); // ✅
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/team`, { headers: authHeaders() })
      .then(res => res.json())
      .then(setTeam);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAdd = async () => {
    if (!form.name || !form.role) return;
    setLoading(true);
    try {
      let avatarUrl = form.avatar;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        avatarUrl = uploadData.url;
      }

      const res = await fetch(`${API_URL}/team`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...form, avatar: avatarUrl })
      });
      const newMember = await res.json();
      setTeam([...team, newMember]);
      setShowModal(false);
      setForm({ name: "", role: "", avatar: "", description: "", status: "Active" }); // ✅
      setPreviewUrl("");
      setImageFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-arabic neon-text">أعضاء الفريق</h2>
          <p className="text-cream/40 text-sm">إدارة الكوادر المبدعة في وكالة فراغ</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-neon flex items-center gap-2">
          <UserPlus size={18} />
          <span className="font-arabic">إضافة عضو</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {team.length === 0 && (
          <div className="col-span-4 glass-card flex items-center justify-center h-40">
            <p className="font-arabic text-cream/40">لا يوجد أعضاء بعد</p>
          </div>
        )}
        {team.map((member, i) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card group hover:border-neon/30 transition-all text-center relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button className="text-cream/20 hover:text-white transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full p-1 border-2 border-dashed border-neon/20 group-hover:border-neon transition-all duration-500">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold text-neon">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className={clsx(
                "absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-dark",
                member.status === "Active" ? "bg-neon" : "bg-yellow-500"
              )}></div>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-bold font-arabic group-hover:neon-text transition-all">{member.name}</h3>
              <p className="text-[10px] text-cream/40 uppercase tracking-widest font-sans">{member.role}</p>
              {/* ✅ الوصف */}
              {member.description && (
                <p className="text-xs text-cream/30 font-arabic mt-2 px-2 leading-relaxed">{member.description}</p>
              )}
            </div>

            <div className="flex items-center justify-around py-3 border-t border-white/5">
              <div className="flex flex-col items-center gap-1">
                <Shield size={14} className="text-cream/20" />
                <span className="text-[9px] text-cream/40 font-arabic">أدمن</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Star size={14} className="text-yellow-500/50" />
                <span className="text-[9px] text-cream/40 font-arabic">مميز</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Coffee size={14} className="text-teal/50" />
                <span className="text-[9px] text-cream/40 font-arabic">متاح</span>
              </div>
            </div>

            <button
              onClick={() => {
                fetch(`${API_URL}/team/${member._id}`, { method: 'DELETE', headers: authHeaders() })
                  .then(() => setTeam(team.filter(m => m._id !== member._id)));
              }}
              className="w-full mt-4 py-2 text-[10px] uppercase tracking-tighter text-red-500/50 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={12} />
              <span>إزالة من الفريق</span>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-arabic">إضافة عضو جديد</h3>
                <button onClick={() => setShowModal(false)} className="text-cream/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-neon/30 hover:border-neon cursor-pointer flex items-center justify-center overflow-hidden transition-all"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Upload size={24} className="text-cream/30" />
                    )}
                  </div>
                  <p className="text-xs text-cream/40 font-arabic">اضغط لرفع صورة</p>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>

                <div>
                  <label className="text-xs text-cream/50 mb-2 block font-arabic">الاسم *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon/50 transition-all"
                    placeholder="اسم العضو"
                  />
                </div>

                <div>
                  <label className="text-xs text-cream/50 mb-2 block font-arabic">المنصب *</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon/50 transition-all"
                    placeholder="Creative Director"
                  />
                </div>

                {/* ✅ حقل الوصف */}
                <div>
                  <label className="text-xs text-cream/50 mb-2 block font-arabic">الوصف</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon/50 transition-all resize-none h-20"
                    placeholder="وصف قصير عن العضو..."
                  />
                </div>

                <div>
                  <label className="text-xs text-cream/50 mb-2 block font-arabic">الحالة</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon/50 transition-all"
                  >
                    <option value="Active">نشط</option>
                    <option value="Away">غائب</option>
                  </select>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="w-full btn-neon py-3 font-arabic text-base mt-2"
                >
                  {loading ? "جاري الإضافة..." : "إضافة العضو"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}