import { Loader2, Shield, Target, Trash2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SiteSections, Value } from "./types";

interface CardListProps {
  items: Value[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  deletingId: string | null;
  onDelete: (id: string) => void;
  onChange: (index: number, field: keyof Value, value: string) => void;
  handleSave: () => Promise<void>;
}

function CardList({ items, editingId, setEditingId, deletingId, onDelete, onChange, handleSave }: CardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={item.id} className="p-4 rounded-xl bg-white/3 border border-white/10 space-y-3 relative group">
          <div className="absolute top-2 left-2 flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <button
              onClick={async () => {
                if (editingId === item.id) { await handleSave(); setEditingId(null); }
                else setEditingId(item.id);
              }}
              className="p-1.5 rounded-lg bg-neon/10 text-neon hover:bg-neon/20 transition-colors text-xs font-arabic"
            >
              {editingId === item.id ? "✓ حفظ" : "✎ تعديل"}
            </button>
            <button onClick={() => onDelete(item.id)} disabled={deletingId === item.id}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">
              {deletingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            </button>
          </div>
          <input type="text" value={item.title}
            onChange={e => onChange(index, "title", e.target.value)}
            disabled={editingId !== item.id}
            className="w-full bg-transparent border-b border-white/10 p-1 text-sm font-bold focus:border-neon/50 outline-none transition-all disabled:opacity-70 disabled:cursor-default"
            placeholder="العنوان..." />
          <textarea value={item.desc}
            onChange={e => onChange(index, "desc", e.target.value)}
            disabled={editingId !== item.id}
            className="w-full bg-transparent text-xs text-cream/50 outline-none h-20 resize-none font-arabic disabled:opacity-70 disabled:cursor-default"
            placeholder="الوصف..." />
        </div>
      ))}
    </div>
  );
}

interface Props {
  sections: SiteSections;
  setSections: (s: SiteSections) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
  handleSave: (s?: SiteSections) => Promise<void>;
}

export function ValuesStudio({ sections, setSections, editingId, setEditingId, deletingId, setDeletingId, handleSave }: Props) {

  // Values handlers
 const handleAddValue = async () => {
  const newId = Date.now().toString();
  const updated = { ...sections, values: { ...sections.values, items: [...sections.values.items, { id: newId, title: "قيمة جديدة", desc: "" }] } };
  setSections(updated);
  setEditingId(newId); // ✅
  await handleSave(updated);
};

const handleAddGoal = async () => {
  const newId = Date.now().toString();
  const updated = { ...sections, goals: { ...sections.goals, items: [...sections.goals.items, { id: newId, title: "هدف جديد", desc: "" }] } };
  setSections(updated);
  setEditingId(newId); // ✅
  await handleSave(updated);
};

  const handleDeleteValue = async (id: string) => {
    setDeletingId(id);
    const updated = { ...sections, values: { ...sections.values, items: sections.values.items.filter(v => v.id !== id) } };
    setSections(updated);
    await handleSave(updated);
    setDeletingId(null);
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const items = [...sections.values.items];
    items[index] = { ...items[index], [field]: value };
    setSections({ ...sections, values: { ...sections.values, items } });
  };

  
  const handleDeleteGoal = async (id: string) => {
    setDeletingId(id);
    const updated = { ...sections, goals: { ...sections.goals, items: sections.goals.items.filter(g => g.id !== id) } };
    setSections(updated);
    await handleSave(updated);
    setDeletingId(null);
  };

  const updateGoal = (index: number, field: keyof Value, value: string) => {
    const items = [...sections.goals.items];
    items[index] = { ...items[index], [field]: value };
    setSections({ ...sections, goals: { ...sections.goals, items } });
  };

  return (
    <>
      {/* Values */}
      <div className="glass-card lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Shield size={20} /></div>
            <h3 className="font-bold font-arabic">المبادئ والقيم</h3>
          </div>
          <button onClick={handleAddValue} className="btn-neon flex items-center gap-2 text-sm">
            <span className="font-arabic">+ إضافة قيمة</span>
          </button>
        </div>
        <SectionHeader
          title={sections.values.title}
          subTitle={sections.values.subTitle}
          onChange={(field, value) => setSections({ ...sections, values: { ...sections.values, [field]: value } })}
        />
        <CardList
          items={sections.values.items}
          editingId={editingId} setEditingId={setEditingId}
          deletingId={deletingId} onDelete={handleDeleteValue}
          onChange={updateValue} handleSave={() => handleSave()}
        />
      </div>

      {/* Goals */}
      <div className="glass-card lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Target size={20} /></div>
            <h3 className="font-bold font-arabic">الأهداف</h3>
          </div>
          <button onClick={handleAddGoal} className="btn-neon flex items-center gap-2 text-sm">
            <span className="font-arabic">+ إضافة هدف</span>
          </button>
        </div>
        <SectionHeader
          title={sections.goals.title}
          subTitle={sections.goals.subTitle}
          onChange={(field, value) => setSections({ ...sections, goals: { ...sections.goals, [field]: value } })}
        />
        <CardList
          items={sections.goals.items}
          editingId={editingId} setEditingId={setEditingId}
          deletingId={deletingId} onDelete={handleDeleteGoal}
          onChange={updateGoal} handleSave={() => handleSave()}
        />
      </div>
    </>
  );
}