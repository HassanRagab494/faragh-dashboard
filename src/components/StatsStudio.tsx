import { BarChart2, Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SiteSections } from "./types";

interface Props {
  sections: SiteSections;
  setSections: (s: SiteSections) => void;
}

export function StatsStudio({ sections, setSections }: Props) {
  return (
    <>
      <div className="glass-card lg:col-span-2 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Users size={20} /></div>
          <h3 className="font-bold font-arabic">عناوين قسم الفريق</h3>
        </div>
        <SectionHeader
          title={sections.teamSection.title}
          subTitle={sections.teamSection.subTitle}
          onChange={(field, value) => setSections({ ...sections, teamSection: { ...sections.teamSection, [field]: value } })}
        />
      </div>

      <div className="glass-card lg:col-span-2 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><BarChart2 size={20} /></div>
          <h3 className="font-bold font-arabic">الإحصائيات</h3>
        </div>
        <SectionHeader
          title={sections.statsSection.title}
          subTitle={sections.statsSection.subTitle}
          onChange={(field, value) => setSections({ ...sections, statsSection: { ...sections.statsSection, [field]: value } })}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/3 border border-white/10">
            <label className="text-xs text-cream/40 font-arabic block mb-2">نسبة رضا العملاء (%)</label>
            <input type="number" min={0} max={100}
              value={sections.stats.clientSatisfaction}
              onChange={e => setSections({ ...sections, stats: { ...sections.stats, clientSatisfaction: parseInt(e.target.value) } })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold focus:border-neon/50 outline-none transition-all" />
          </div>
          <div className="p-4 rounded-xl bg-white/3 border border-white/10">
            <label className="text-xs text-cream/40 font-arabic block mb-2">المشاريع الناجحة</label>
            <input type="number" min={0}
              value={sections.stats.successfulProjects}
              onChange={e => setSections({ ...sections, stats: { ...sections.stats, successfulProjects: parseInt(e.target.value) } })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold focus:border-neon/50 outline-none transition-all" />
          </div>
          <div className="p-4 rounded-xl bg-white/3 border border-white/10 flex flex-col justify-between">
            <label className="text-xs text-cream/40 font-arabic block mb-2">دعم 24 ساعة</label>
            <button
              onClick={() => setSections({ ...sections, stats: { ...sections.stats, support24h: !sections.stats.support24h } })}
              className={`w-full py-3 rounded-xl font-arabic text-sm font-bold transition-all ${sections.stats.support24h ? "bg-neon/20 text-neon border border-neon/30" : "bg-white/5 text-cream/40 border border-white/10"}`}
            >
              {sections.stats.support24h ? "✓ مفعّل" : "✗ غير مفعّل"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}