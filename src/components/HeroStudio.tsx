import { Globe } from "lucide-react";
import { SiteSections } from "./types";

interface Props {
  sections: SiteSections;
  setSections: (s: SiteSections) => void;
}

export function HeroStudio({ sections, setSections }: Props) {
  return (
    <div className="glass-card lg:col-span-2 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-neon/10 rounded-lg text-neon"><Globe size={20} /></div>
        <h3 className="font-bold font-arabic">قسم العرض (Hero)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-cream/40 font-arabic block mb-2">العنوان الرئيسي (Bold)</label>
          <textarea
            value={sections.hero.title}
            onChange={e => setSections({ ...sections, hero: { ...sections.hero, title: e.target.value } })}
            onInput={e => { const el = e.target as HTMLTextAreaElement; el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold focus:border-neon/50 outline-none transition-all resize-none overflow-hidden"
          />
        </div>
        <div>
          <label className="text-xs text-cream/40 font-arabic block mb-2">الوصف الفرعي (Medium)</label>
          <textarea
            value={sections.hero.subTitle}
            onChange={e => setSections({ ...sections, hero: { ...sections.hero, subTitle: e.target.value } })}
            onInput={e => { const el = e.target as HTMLTextAreaElement; el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-medium focus:border-neon/50 outline-none transition-all resize-none overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
}