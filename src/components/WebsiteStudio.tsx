import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, Globe, Info, Headphones, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { API_URL, authHeaders } from "../api";

interface Service {
  id: string;
  name: string;
  description: string;
}

interface SiteSections {
  hero: { title: string; subTitle: string; cta: string };
  about: {
  title: string;
  subTitle: string;
  cards: { icon: string; title: string; content: string }[];
};  services: Service[];
  contact: { whatsapp: string; email: string; instagram: string };
}

const defaultSections: SiteSections = {
  hero: { title: "", subTitle: "", cta: "ابدأ رحلتك" },
  about: {
  title: "",
  subTitle: "",
  cards: [
    { icon: "company", title: "نبذة عن الشركة", content: "" },
    { icon: "message", title: "الرسالة", content: "" },
    { icon: "vision", title: "الرؤية", content: "" },
  ]
},  services: [],
  contact: { whatsapp: "", email: "", instagram: "" }
};

export default function WebsiteStudio() {
  const [sections, setSections] = useState<SiteSections>(defaultSections);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const buildPayload = (s: SiteSections) => {
    const items: Record<string, string> = {
      hero_title: s.hero.title,
      hero_subtitle: s.hero.subTitle,
      hero_cta: s.hero.cta,
     about_title: s.about.title,
about_subtitle: s.about.subTitle,
about_card1_title: s.about.cards[0]?.title || "",
about_card1_content: s.about.cards[0]?.content || "",
about_card2_title: s.about.cards[1]?.title || "",
about_card2_content: s.about.cards[1]?.content || "",
about_card3_title: s.about.cards[2]?.title || "",
about_card3_content: s.about.cards[2]?.content || "",
      contact_whatsapp: s.contact.whatsapp,
      contact_email: s.contact.email,
      contact_instagram: s.contact.instagram,
      services_count: s.services.length.toString(),
    };
    s.services.forEach((sv, i) => {
      items[`service${i + 1}_name`] = sv.name;
      items[`service${i + 1}_desc`] = sv.description;
    });
    return items;
  };

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then(res => res.json())
      .then(data => {
        const count = parseInt(data.services_count || "0");
        const services = Array.from({ length: count }, (_, i) => ({
          id: (i + 1).toString(),
          name: data[`service${i + 1}_name`] || "",
          description: data[`service${i + 1}_desc`] || "",
        }));
        setSections({
          hero: {
            title: data.hero_title || "",
            subTitle: data.hero_subtitle || "",
            cta: data.hero_cta || "ابدأ رحلتك",
          },
        about: {
  title: data.about_title || "",
  subTitle: data.about_subtitle || "",
  cards: [
    { icon: "company", title: data.about_card1_title || "نبذة عن الشركة", content: data.about_card1_content || "" },
    { icon: "message", title: data.about_card2_title || "الرسالة", content: data.about_card2_content || "" },
    { icon: "vision", title: data.about_card3_title || "الرؤية", content: data.about_card3_content || "" },
  ]
},
          services,
          contact: {
            whatsapp: data.contact_whatsapp || "",
            email: data.contact_email || "",
            instagram: data.contact_instagram || "",
          }
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (updatedSections?: SiteSections) => {
    setSaving(true);
    const payload = buildPayload(updatedSections || sections);
    await fetch(`${API_URL}/content/update`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });
    setSaving(false);
  };

  const handleDeleteService = async (id: string) => {
    setDeletingId(id);
    const updated = {
      ...sections,
      services: sections.services.filter(s => s.id !== id),
    };
    setSections(updated);
    await handleSave(updated);
    setDeletingId(null);
  };

  const handleAddService = async () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: "خدمة جديدة",
      description: "",
    };
    const updated = { ...sections, services: [...sections.services, newService] };
    setSections(updated);
    setEditingId(newService.id);
    await handleSave(updated);
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const s = [...sections.services];
    s[index] = { ...s[index], [field]: value };
    setSections({ ...sections, services: s });
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center gap-3 font-arabic opacity-50">
      <Loader2 className="animate-spin" size={20} />
      <span>جاري تحميل بيانات الموقع...</span>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-arabic neon-text">استوديو الموقع</h2>
          <p className="text-cream/40 text-sm">تحديث محتوى الموقع الرسمي بشكل مباشر</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => handleSave()} disabled={saving} className="btn-neon flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />}
            <span className="font-arabic">{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card lg:col-span-2 space-y-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-neon/10 rounded-lg text-neon"><Globe size={20} /></div>
    <h3 className="font-bold font-arabic">قسم العرض (Hero)</h3>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="text-xs text-cream/40 font-arabic block mb-2">العنوان الرئيسي</label>
      <textarea
        value={sections.hero.title}
        onChange={e => setSections({...sections, hero: {...sections.hero, title: e.target.value}})}
        onInput={e => { const el = e.target as HTMLTextAreaElement; el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-neon/50 outline-none transition-all resize-none overflow-hidden"
      />
    </div>
    <div>
      <label className="text-xs text-cream/40 font-arabic block mb-2">الوصف الفرعي</label>
      <textarea
        value={sections.hero.subTitle}
        onChange={e => setSections({...sections, hero: {...sections.hero, subTitle: e.target.value}})}
        onInput={e => { const el = e.target as HTMLTextAreaElement; el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-neon/50 outline-none transition-all resize-none overflow-hidden"
      />
    </div>
 
  </div>
</motion.div>

        {/* About Section */}
       <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card lg:col-span-2 space-y-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Info size={20} /></div>
    <h3 className="font-bold font-arabic">قسم "من نحن"</h3>
  </div>

  {/* العنوانين */}
  

  {/* الكروت الثلاثة */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {sections.about.cards.map((card, i) => (
      <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/10 space-y-3">
        <div>
          <label className="text-xs text-cream/40 font-arabic block mb-2">عنوان الكارت</label>
          <input type="text" value={card.title}
            onChange={e => {
              const cards = [...sections.about.cards];
              cards[i] = { ...cards[i], title: e.target.value };
              setSections({...sections, about: {...sections.about, cards}});
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-sm font-bold outline-none focus:border-neon/50 transition-all" />
        </div>
        <div>
          <label className="text-xs text-cream/40 font-arabic block mb-2">محتوى الكارت</label>
          <textarea value={card.content}
            onChange={e => {
              const cards = [...sections.about.cards];
              cards[i] = { ...cards[i], content: e.target.value };
              setSections({...sections, about: {...sections.about, cards}});
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-cream/50 outline-none h-24 resize-none font-arabic focus:border-neon/50 transition-all"
            placeholder="محتوى الكارت..." />
        </div>
      </div>
    ))}
  </div>
</motion.div>

        {/* Services Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal/10 rounded-lg text-teal"><Headphones size={20} /></div>
              <h3 className="font-bold font-arabic">إدارة الخدمات</h3>
            </div>
            <button onClick={handleAddService} className="btn-neon flex items-center gap-2 text-sm">
              <span className="font-arabic">+ إضافة خدمة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.services.map((service, index) => (
              <div key={service.id} className="p-4 rounded-xl bg-white/3 border border-white/10 space-y-3 relative group">

                {/* أزرار التحكم */}
                <div className="absolute top-2 left-2 flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
                  {/* زرار التعديل */}
                  <button
                    onClick={async () => {
  if (editingId === service.id) {
    await handleSave(); // احفظ الأول
    setEditingId(null);
  } else {
    setEditingId(service.id);
  }
}}                    className="p-1.5 rounded-lg bg-neon/10 text-neon hover:bg-neon/20 transition-colors text-xs font-arabic"
                  >
                    {editingId === service.id ? "✓ حفظ" : "✎ تعديل"}
                  </button>

                  {/* زرار الحذف */}
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    disabled={deletingId === service.id}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {deletingId === service.id
                      ? <Loader2 size={12} className="animate-spin" />
                      : <Trash2 size={12} />
                    }
                  </button>
                </div>

                {/* اسم الخدمة */}
                <input
                  type="text"
                  value={service.name}
                  onChange={e => updateService(index, "name", e.target.value)}
                  disabled={editingId !== service.id}
                  className="w-full bg-transparent border-b border-white/10 p-1 text-sm focus:border-neon/50 outline-none transition-all font-bold disabled:opacity-70 disabled:cursor-default"
                />

                {/* وصف الخدمة */}
                <textarea
                  value={service.description}
                  onChange={e => updateService(index, "description", e.target.value)}
                  disabled={editingId !== service.id}
                  className="w-full bg-transparent text-xs text-cream/50 outline-none h-20 resize-none font-arabic disabled:opacity-70 disabled:cursor-default"
                  placeholder="وصف الخدمة..."
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><MessageSquare size={20} /></div>
            <h3 className="font-bold font-arabic">معلومات التواصل</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] text-cream/40 uppercase font-sans block mb-2 tracking-widest">WhatsApp</label>
              <input type="text" value={sections.contact.whatsapp} onChange={e => setSections({...sections, contact: {...sections.contact, whatsapp: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-sans focus:border-neon/50 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] text-cream/40 uppercase font-sans block mb-2 tracking-widest">Email</label>
              <input type="text" value={sections.contact.email} onChange={e => setSections({...sections, contact: {...sections.contact, email: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-sans focus:border-neon/50 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] text-cream/40 uppercase font-sans block mb-2 tracking-widest">Instagram</label>
              <input type="text" value={sections.contact.instagram} onChange={e => setSections({...sections, contact: {...sections.contact, instagram: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-sans focus:border-neon/50 outline-none transition-all" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}