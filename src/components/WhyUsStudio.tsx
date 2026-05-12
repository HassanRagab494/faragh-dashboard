import { Loader2, Target, Trash2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SiteSections } from "./types";

interface Props {
  sections: SiteSections;
  setSections: (s: SiteSections) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  deletingId: string | null;
  handleSave: (s?: SiteSections) => Promise<void>;
}

export function WhyUsStudio({ sections, setSections, editingId, setEditingId, deletingId, handleSave }: Props) {
 const handleAdd = async () => {
  const newId = Date.now().toString();
  const updated = {
    ...sections,
    whyUs: {
      ...sections.whyUs,
      reasons: [...sections.whyUs.reasons, { id: newId, title: "سبب جديد", desc: "" }]
    }
  };
  setSections(updated);
  setEditingId(newId); 
  await handleSave(updated);
};
  const handleDelete = async (id: string) => {
    const updated = {
      ...sections,
      whyUs: { ...sections.whyUs, reasons: sections.whyUs.reasons.filter(r => r.id !== id) }
    };
    setSections(updated);
    await handleSave(updated);
  };

  return (
    <div className="glass-card lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Target size={20} /></div>
          <h3 className="font-bold font-arabic">لماذا تختارنا</h3>
        </div>
        <button onClick={handleAdd} className="btn-neon flex items-center gap-2 text-sm">
          <span className="font-arabic">+ إضافة سبب</span>
        </button>
      </div>

      <SectionHeader
        title={sections.whyUs.title}
        subTitle={sections.whyUs.subTitle}
        onChange={(field, value) => setSections({ ...sections, whyUs: { ...sections.whyUs, [field]: value } })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.whyUs.reasons.map((reason, index) => (
          <div key={reason.id} className="p-4 rounded-xl bg-white/3 border border-white/10 space-y-3 relative group">
            <div className="absolute top-2 left-2 flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
              <button
                onClick={async () => {
                  if (editingId === reason.id) { await handleSave(); setEditingId(null); }
                  else setEditingId(reason.id);
                }}
                className="p-1.5 rounded-lg bg-neon/10 text-neon hover:bg-neon/20 transition-colors text-xs font-arabic"
              >
                {editingId === reason.id ? "✓ حفظ" : "✎ تعديل"}
              </button>
              <button
                onClick={() => handleDelete(reason.id)}
                disabled={deletingId === reason.id}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {deletingId === reason.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              </button>
            </div>

            <input
              type="text"
              value={reason.title}
              onChange={e => {
                const reasons = [...sections.whyUs.reasons];
                reasons[index] = { ...reasons[index], title: e.target.value };
                setSections({ ...sections, whyUs: { ...sections.whyUs, reasons } });
              }}
              disabled={editingId !== reason.id}
              className="w-full bg-transparent border-b border-white/10 p-1 text-sm font-bold focus:border-neon/50 outline-none transition-all disabled:opacity-70 disabled:cursor-default"
              placeholder="عنوان السبب..."
            />
            <textarea
              value={reason.desc}
              onChange={e => {
                const reasons = [...sections.whyUs.reasons];
                reasons[index] = { ...reasons[index], desc: e.target.value };
                setSections({ ...sections, whyUs: { ...sections.whyUs, reasons } });
              }}
              disabled={editingId !== reason.id}
              className="w-full bg-transparent text-xs text-cream/50 outline-none h-20 resize-none font-arabic disabled:opacity-70 disabled:cursor-default"
              placeholder="وصف السبب..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}