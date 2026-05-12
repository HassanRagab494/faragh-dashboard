import { Headphones, Loader2, Trash2, Plus, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SiteSections, Service } from "./types";

interface Props {
  sections: SiteSections;
  setSections: (s: SiteSections) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  deletingId: string | null;
  handleSave: (s?: SiteSections) => Promise<void>;
  handleDeleteService: (id: string) => Promise<void>;
  handleAddService: () => Promise<void>;
}

export function ServicesStudio({ sections, setSections, editingId, setEditingId, deletingId, handleSave, handleDeleteService, handleAddService }: Props) {
  const updateService = (index: number, field: keyof Service, value: any) => {
    const s = [...sections.services];
    s[index] = { ...s[index], [field]: value };
    setSections({ ...sections, services: s });
  };

  const addItem = (index: number) => {
    const s = [...sections.services];
    s[index] = { ...s[index], items: [...(s[index].items || []), ""] };
    setSections({ ...sections, services: s });
  };

  const updateItem = (serviceIndex: number, itemIndex: number, value: string) => {
    const s = [...sections.services];
    const items = [...(s[serviceIndex].items || [])];
    items[itemIndex] = value;
    s[serviceIndex] = { ...s[serviceIndex], items };
    setSections({ ...sections, services: s });
  };

  const removeItem = (serviceIndex: number, itemIndex: number) => {
    const s = [...sections.services];
    const items = [...(s[serviceIndex].items || [])];
    items.splice(itemIndex, 1);
    s[serviceIndex] = { ...s[serviceIndex], items };
    setSections({ ...sections, services: s });
  };

  return (
    <div className="glass-card lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal/10 rounded-lg text-teal"><Headphones size={20} /></div>
          <h3 className="font-bold font-arabic">إدارة الخدمات</h3>
        </div>
        <button onClick={handleAddService} className="btn-neon flex items-center gap-2 text-sm">
          <span className="font-arabic">+ إضافة خدمة</span>
        </button>
      </div>

      <SectionHeader
        title={sections.servicesSection.title}
        subTitle={sections.servicesSection.subTitle}
        onChange={(field, value) => setSections({ ...sections, servicesSection: { ...sections.servicesSection, [field]: value } })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.services.map((service, index) => (
          <div key={service.id} className="p-4 rounded-xl bg-white/3 border border-white/10 space-y-3 relative group">
            {/* أزرار التحكم */}
            <div className="absolute top-2 left-2 flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
              <button
                onClick={async () => {
                  if (editingId === service.id) { await handleSave(); setEditingId(null); }
                  else setEditingId(service.id);
                }}
                className="p-1.5 rounded-lg bg-neon/10 text-neon hover:bg-neon/20 transition-colors text-xs font-arabic"
              >
                {editingId === service.id ? "✓ حفظ" : "✎ تعديل"}
              </button>
              <button onClick={() => handleDeleteService(service.id)} disabled={deletingId === service.id}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                {deletingId === service.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              </button>
            </div>

            {/* أيقون */}
            <div>
              <label className="text-xs text-cream/40 font-arabic block mb-1">اسم الأيقون (Lucide)</label>
              <input type="text" value={service.icon}
                onChange={e => updateService(index, "icon", e.target.value)}
                disabled={editingId !== service.id}
                className="w-full bg-transparent border-b border-white/10 p-1 text-xs text-cream/50 focus:border-neon/50 outline-none transition-all disabled:opacity-50 disabled:cursor-default"
                placeholder="مثال: Palette, Code2, Globe..." />
            </div>

            {/* اسم الخدمة */}
            <input type="text" value={service.name}
              onChange={e => updateService(index, "name", e.target.value)}
              disabled={editingId !== service.id}
              className="w-full bg-transparent border-b border-white/10 p-1 text-sm focus:border-neon/50 outline-none transition-all font-bold disabled:opacity-70 disabled:cursor-default" />

            {/* وصف الخدمة */}
            <textarea value={service.description}
              onChange={e => updateService(index, "description", e.target.value)}
              disabled={editingId !== service.id}
              className="w-full bg-transparent text-xs text-cream/50 outline-none h-16 resize-none font-arabic disabled:opacity-70 disabled:cursor-default"
              placeholder="وصف الخدمة..." />

            {/* ✅ Items - ماذا نقدم */}
            <div className="border-t border-white/10 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-cream/40 font-arabic">ماذا نقدم في هذه الخدمة</label>
                {editingId === service.id && (
                  <button
                    onClick={() => addItem(index)}
                    className="flex items-center gap-1 text-xs text-neon hover:text-neon/80 transition-colors"
                  >
                    <Plus size={12} />
                    <span className="font-arabic">إضافة</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(service.items || []).map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon/50 flex-shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={e => updateItem(index, itemIndex, e.target.value)}
                      disabled={editingId !== service.id}
                      className="flex-1 bg-transparent text-xs text-cream/60 outline-none border-b border-white/5 focus:border-neon/30 transition-all disabled:opacity-60 disabled:cursor-default"
                      placeholder="عنصر الخدمة..."
                    />
                    {editingId === service.id && (
                      <button
                        onClick={() => removeItem(index, itemIndex)}
                        className="text-red-400/50 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                {(service.items || []).length === 0 && (
                  <p className="text-xs text-cream/20 font-arabic">
                    {editingId === service.id ? "اضغط + لإضافة عناصر" : "لا توجد عناصر"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}