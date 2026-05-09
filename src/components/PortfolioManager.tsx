import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit2, X, Upload, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { API_URL, authHeaders } from "../api";

interface Project {
  _id: string;
  title: string;
  client: string;
  category: string;
  status: string;
  description: string;
  thumbnail: string;
  mediaType: 'image' | 'video';
}

interface ProjectForm {
  title: string;
  client: string;
  category: string;
  description: string;
}

export default function PortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>({ title: "", client: "", category: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null); // ✅ جديد
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = () => {
    setLoading(true);
    fetch(`${API_URL}/projects`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = () => {
    setEditingProject(null);
    setForm({ title: "", client: "", category: "", description: "" });
   setImageFile(null);
setImagePreview(null);
setError(null);
    setShowModal(true);
  };

  // ✅ فتح المودال بيانات المشروع الموجود
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      client: project.client,
      category: project.category,
      description: project.description || "",
    });
    setImageFile(null);
    setImagePreview(project.thumbnail || null);
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setEditingProject(null);
  };

 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
  setMediaType(file.type.startsWith('video/') ? 'video' : 'image'); // ✅
};

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("عنوان المشروع مطلوب");
    if (!form.client.trim()) return setError("اسم العميل مطلوب");
    if (!form.category.trim()) return setError("تصنيف المشروع مطلوب");
    setError(null);
    setSubmitting(true);

    try {
      let thumbnailUrl = editingProject?.thumbnail || "";

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const auth = authHeaders() as Record<string, string>;
        delete auth["Content-Type"];
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: auth,
          body: fd,
        });
        if (!uploadRes.ok) throw new Error("فشل في رفع الصورة");
        const uploadData = await uploadRes.json();
        thumbnailUrl = uploadData.url || "";
      }

      // ✅ لو تعديل استخدم PUT، لو إضافة استخدم POST
      if (editingProject) {
        const res = await fetch(`${API_URL}/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
body: JSON.stringify({ ...form, thumbnail: thumbnailUrl, mediaType }),
        });
        if (!res.ok) throw new Error("فشل في تعديل المشروع");
      } else {
        const res = await fetch(`${API_URL}/projects`, {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
body: JSON.stringify({ ...form, thumbnail: thumbnailUrl, mediaType }),
        });
        if (!res.ok) throw new Error("فشل في إضافة المشروع");
      }

      await fetchProjects();
      setShowModal(false);
      setEditingProject(null);
    } catch (err: any) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("فشل في حذف المشروع");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-arabic neon-text">معرض الأعمال</h2>
          <p className="text-cream/40 text-sm">إدارة المشاريع المعروضة في المحفظة الرقمية</p>
        </div>
        <button onClick={openModal} className="btn-neon flex items-center gap-2">
          <Plus size={18} />
          <span className="font-arabic">مشروع جديد</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-neon" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="group glass-card p-0 overflow-hidden relative border border-white/5 hover:border-neon/30 transition-all duration-500"
            >
              <div className="aspect-video w-full overflow-hidden relative bg-white/5">
               {project.thumbnail ? (
  project.mediaType === 'video' ? (
    <video
      src={project.thumbnail}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      muted
      loop
      autoPlay
    />
  ) : (
    <img
      src={project.thumbnail}
      alt={project.title}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  )
) : (
                  <div className="w-full h-full flex items-center justify-center text-cream/20">
                    <Edit2 size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />

                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm bg-dark/40">
                  {/* ✅ زرار التعديل متربط دلوقتي */}
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-all disabled:opacity-50"
                  >
                    {deletingId === project._id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-neon/60 font-sans">{project.category}</span>
                  <span className="text-[10px] text-cream/30 font-arabic">{project.client}</span>
                </div>
                <h3 className="text-lg font-bold font-arabic group-hover:text-neon transition-colors">{project.title}</h3>
                {project.description && (
                  <p className="text-cream/40 text-xs font-arabic mt-1 line-clamp-2">{project.description}</p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Add button */}
          <button
            onClick={openModal}
            className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 py-12 hover:border-neon/50 hover:bg-neon/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon/50 group-hover:text-neon transition-all">
              <Plus size={24} />
            </div>
            <span className="font-arabic text-cream/40 group-hover:text-neon transition-colors">إضافة عمل إبداعي</span>
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50"
            />

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="glass-card w-full max-w-lg pointer-events-auto border border-white/10 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    {/* ✅ العنوان بيتغير حسب Add أو Edit */}
                    <h3 className="text-xl font-bold font-arabic neon-text">
                      {editingProject ? "تعديل المشروع" : "مشروع جديد"}
                    </h3>
                    <p className="text-cream/40 text-xs mt-1">
                      {editingProject ? "عدّل بيانات المشروع" : "أضف عملاً جديداً لمعرض الأعمال"}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-cream/50 hover:text-cream transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Image Upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all cursor-pointer overflow-hidden mb-5 group"
                >
                {imagePreview ? (
  mediaType === 'video' ? (
    <video
      src={imagePreview}
      className="w-full h-full object-cover"
      muted
      loop
      autoPlay
    />
  ) : (
    <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
  )
) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-cream/30 group-hover:text-neon transition-colors">
                      <Upload size={28} />
                      <span className="font-arabic text-sm">اضغط لرفع صورة المشروع</span>
<span className="text-xs opacity-60">PNG, JPG, MP4, MOV حتى 50MB</span>                    </div>
                  )}
                  {imagePreview && (
                    <div className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-cream">
                      <Upload size={20} />
                      <span className="font-arabic text-sm">تغيير الصورة</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"      
                              className="hidden"
                  onChange={handleImageChange}
                />

                {/* Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-cream/50 font-arabic mb-1.5">عنوان المشروع *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="مثال: هوية بصرية لمطعم نخيل"
                      className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-arabic focus:outline-none focus:border-neon/50 transition-all placeholder:text-cream/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-cream/50 font-arabic mb-1.5">اسم العميل *</label>
                    <input
                      type="text"
                      value={form.client}
                      onChange={(e) => setForm({ ...form, client: e.target.value })}
                      placeholder="مثال: مطعم نخيل"
                      className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-arabic focus:outline-none focus:border-neon/50 transition-all placeholder:text-cream/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-cream/50 font-arabic mb-1.5">تصنيف المشروع *</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="مثال: تصميم هوية، تطوير موقع..."
                      className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-arabic focus:outline-none focus:border-neon/50 transition-all placeholder:text-cream/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-cream/50 font-arabic mb-1.5">وصف المشروع</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="وصف مختصر للمشروع..."
                      rows={3}
                      className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-arabic focus:outline-none focus:border-neon/50 transition-all placeholder:text-cream/20 resize-none"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-red-400 text-xs font-arabic"
                  >
                    ⚠️ {error}
                  </motion.p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 btn-neon flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span className="font-arabic">جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        {/* ✅ نص الزرار بيتغير حسب Add أو Edit */}
                        {editingProject ? <Edit2 size={16} /> : <Plus size={16} />}
                        <span className="font-arabic">{editingProject ? "حفظ التعديلات" : "إضافة المشروع"}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={submitting}
                    className="px-5 py-2.5 border border-white/10 rounded-xl text-cream/50 hover:text-cream hover:border-white/20 transition-all font-arabic text-sm disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}