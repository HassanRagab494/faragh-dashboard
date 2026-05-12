import { useState, useEffect } from "react";
import { Save, MessageSquare, Loader2 } from "lucide-react";
import { API_URL, authHeaders } from "../api";
import { SiteSections, Service } from "./types";
import { HeroStudio } from "./HeroStudio";
import { AboutStudio } from "./AboutStudio";
import { ServicesStudio } from "./ServicesStudio";
import { StatsStudio } from "./StatsStudio";
import { WhyUsStudio } from "./WhyUsStudio";
import { ValuesStudio } from "./ValuesStudio";
import { PortfolioStudio } from "./PortfolioStudio";

const defaultSections: SiteSections = {
  hero: { title: "", subTitle: "", cta: "ابدأ رحلتك" },
  about: {
    title: "", subTitle: "",
    cards: [
      { icon: "company", title: "نبذة عن الشركة", content: "" },
      { icon: "message", title: "الرسالة", content: "" },
      { icon: "vision", title: "الرؤية", content: "" },
    ]
  },
  services: [],
  servicesSection: { title: "", subTitle: "" },
  teamSection: { title: "", subTitle: "" },
  statsSection: { title: "", subTitle: "" },
  stats: { clientSatisfaction: 95, successfulProjects: 0, support24h: true },
  contact: { whatsapp: "", email: "", instagram: "" },
  whyUs: { title: "", subTitle: "", reasons: [] },
  values: { title: "", subTitle: "", items: [] },
  goals: { title: "", subTitle: "", items: [] },
  portfolioSection: { title: "", subTitle: "" },
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
      services_title: s.servicesSection.title,
      services_subtitle: s.servicesSection.subTitle,
      team_title: s.teamSection.title,
      team_subtitle: s.teamSection.subTitle,
      stats_title: s.statsSection.title,
      stats_subtitle: s.statsSection.subTitle,
      stats_clientSatisfaction: s.stats.clientSatisfaction.toString(),
      stats_successfulProjects: s.stats.successfulProjects.toString(),
      stats_support24h: s.stats.support24h.toString(),
      contact_whatsapp: s.contact.whatsapp,
      contact_email: s.contact.email,
      contact_instagram: s.contact.instagram,
      services_count: s.services.length.toString(),
      whyus_title: s.whyUs.title,
      whyus_subtitle: s.whyUs.subTitle,
      whyus_count: s.whyUs.reasons.length.toString(),
      values_title: s.values.title,
      values_subtitle: s.values.subTitle,
      values_count: s.values.items.length.toString(),
      goals_title: s.goals.title,
      goals_subtitle: s.goals.subTitle,
      goals_count: s.goals.items.length.toString(),
      portfolio_title: s.portfolioSection.title,
      portfolio_subtitle: s.portfolioSection.subTitle,
    };

    s.services.forEach((sv, i) => {
      items[`service${i + 1}_name`] = sv.name;
      items[`service${i + 1}_desc`] = sv.description;
      items[`service${i + 1}_icon`] = sv.icon || "";
      items[`service${i + 1}_items_count`] = (sv.items || []).length.toString();
      (sv.items || []).forEach((item, j) => {
        items[`service${i + 1}_item${j + 1}`] = item;
      });
    });

    s.whyUs.reasons.forEach((r, i) => {
      items[`whyus${i + 1}_title`] = r.title;
      items[`whyus${i + 1}_desc`] = r.desc;
    });

    s.values.items.forEach((v, i) => {
      items[`value${i + 1}_title`] = v.title;
      items[`value${i + 1}_desc`] = v.desc;
    });

    s.goals.items.forEach((g, i) => {
      items[`goal${i + 1}_title`] = g.title;
      items[`goal${i + 1}_desc`] = g.desc;
    });

    return items;
  };

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then(res => res.json())
      .then(data => {
        const servicesCount = parseInt(data.services_count || "0");
        const whyusCount = parseInt(data.whyus_count || "0");
        const valuesCount = parseInt(data.values_count || "0");
        const goalsCount = parseInt(data.goals_count || "0");

        setSections({
          hero: { title: data.hero_title || "", subTitle: data.hero_subtitle || "", cta: data.hero_cta || "ابدأ رحلتك" },
          about: {
            title: data.about_title || "", subTitle: data.about_subtitle || "",
            cards: [
              { icon: "company", title: data.about_card1_title || "نبذة عن الشركة", content: data.about_card1_content || "" },
              { icon: "message", title: data.about_card2_title || "الرسالة", content: data.about_card2_content || "" },
              { icon: "vision", title: data.about_card3_title || "الرؤية", content: data.about_card3_content || "" },
            ]
          },
          services: Array.from({ length: servicesCount }, (_, i) => {
            const itemsCount = parseInt(data[`service${i + 1}_items_count`] || "0");
            return {
              id: (i + 1).toString(),
              name: data[`service${i + 1}_name`] || "",
              description: data[`service${i + 1}_desc`] || "",
              icon: data[`service${i + 1}_icon`] || "",
              items: Array.from({ length: itemsCount }, (_, j) => data[`service${i + 1}_item${j + 1}`] || ""),
            };
          }),
          servicesSection: { title: data.services_title || "", subTitle: data.services_subtitle || "" },
          teamSection: { title: data.team_title || "", subTitle: data.team_subtitle || "" },
          statsSection: { title: data.stats_title || "", subTitle: data.stats_subtitle || "" },
          stats: {
            clientSatisfaction: parseInt(data.stats_clientSatisfaction || "95"),
            successfulProjects: parseInt(data.stats_successfulProjects || "0"),
            support24h: data.stats_support24h === "true",
          },
          contact: { whatsapp: data.contact_whatsapp || "", email: data.contact_email || "", instagram: data.contact_instagram || "" },
          whyUs: {
            title: data.whyus_title || "",
            subTitle: data.whyus_subtitle || "",
            reasons: Array.from({ length: whyusCount }, (_, i) => ({
              id: (i + 1).toString(),
              title: data[`whyus${i + 1}_title`] || "",
              desc: data[`whyus${i + 1}_desc`] || "",
            })),
          },
          values: {
            title: data.values_title || "",
            subTitle: data.values_subtitle || "",
            items: Array.from({ length: valuesCount }, (_, i) => ({
              id: (i + 1).toString(),
              title: data[`value${i + 1}_title`] || "",
              desc: data[`value${i + 1}_desc`] || "",
            })),
          },
          goals: {
            title: data.goals_title || "",
            subTitle: data.goals_subtitle || "",
            items: Array.from({ length: goalsCount }, (_, i) => ({
              id: (i + 1).toString(),
              title: data[`goal${i + 1}_title`] || "",
              desc: data[`goal${i + 1}_desc`] || "",
            })),
          },
          portfolioSection: {
            title: data.portfolio_title || "",
            subTitle: data.portfolio_subtitle || "",
          },
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (updatedSections?: SiteSections) => {
    setSaving(true);
    await fetch(`${API_URL}/content/update`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ items: buildPayload(updatedSections || sections) }),
    });
    setSaving(false);
  };

  const handleDeleteService = async (id: string) => {
    setDeletingId(id);
    const updated = { ...sections, services: sections.services.filter(s => s.id !== id) };
    setSections(updated);
    await handleSave(updated);
    setDeletingId(null);
  };

  const handleAddService = async () => {
    const newService: Service = { id: Date.now().toString(), name: "خدمة جديدة", description: "", icon: "", items: [] };
    const updated = { ...sections, services: [...sections.services, newService] };
    setSections(updated);
    setEditingId(newService.id);
    await handleSave(updated);
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center gap-3 font-arabic opacity-50">
      <Loader2 className="animate-spin" size={20} />
      <span>جاري تحميل بيانات الموقع...</span>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-arabic neon-text">استوديو الموقع</h2>
          <p className="text-cream/40 text-sm">تحديث محتوى الموقع الرسمي بشكل مباشر</p>
        </div>
        {/* ✅ زرار الحفظ عايم */}
        <button onClick={() => handleSave()} disabled={saving} className="btn-neon flex items-center gap-2 fixed top-4 left-4 z-50">          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />}
          <span className="font-arabic">{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HeroStudio sections={sections} setSections={setSections} />
        <AboutStudio sections={sections} setSections={setSections} />
        <ServicesStudio
          sections={sections} setSections={setSections}
          editingId={editingId} setEditingId={setEditingId}
          deletingId={deletingId} handleSave={handleSave}
          handleDeleteService={handleDeleteService} handleAddService={handleAddService}
        />
        <PortfolioStudio sections={sections} setSections={setSections} />
        <WhyUsStudio
          sections={sections} setSections={setSections}
          editingId={editingId} setEditingId={setEditingId}
          deletingId={deletingId} setDeletingId={setDeletingId}
          handleSave={handleSave}
        />
        <ValuesStudio
          sections={sections} setSections={setSections}
          editingId={editingId} setEditingId={setEditingId}
          deletingId={deletingId} setDeletingId={setDeletingId}
          handleSave={handleSave}
        />
        <StatsStudio sections={sections} setSections={setSections} />

        {/* Contact */}
        <div className="glass-card lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><MessageSquare size={20} /></div>
            <h3 className="font-bold font-arabic">معلومات التواصل</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["whatsapp", "email", "instagram"].map(field => (
              <div key={field}>
                <label className="text-[10px] text-cream/40 uppercase font-sans block mb-2 tracking-widest">{field}</label>
                <input type="text"
                  value={sections.contact[field as keyof typeof sections.contact]}
                  onChange={e => setSections({ ...sections, contact: { ...sections.contact, [field]: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-sans focus:border-neon/50 outline-none transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}