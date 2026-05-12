import { Info } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SiteSections } from "./types";

interface Props {
  sections: SiteSections;
  setSections: (s: SiteSections) => void;
}

export function AboutStudio({ sections, setSections }: Props) {
  return (
    <div className="glass-card lg:col-span-2 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Info size={20} /></div>
        <h3 className="font-bold font-arabic">قسم "من نحن"</h3>
      </div>
      <SectionHeader
        title={sections.about.title}
        subTitle={sections.about.subTitle}
        onChange={(field, value) => setSections({ ...sections, about: { ...sections.about, [field]: value } })}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.about.cards.map((card, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/10 space-y-3">
            <div>
              <label className="text-xs text-cream/40 font-arabic block mb-2">عنوان الكارت</label>
              <input type="text" value={card.title}
                onChange={e => {
                  const cards = [...sections.about.cards];
                  cards[i] = { ...cards[i], title: e.target.value };
                  setSections({ ...sections, about: { ...sections.about, cards } });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-sm font-bold outline-none focus:border-neon/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-cream/40 font-arabic block mb-2">محتوى الكارت</label>
              <textarea value={card.content}
                onChange={e => {
                  const cards = [...sections.about.cards];
                  cards[i] = { ...cards[i], content: e.target.value };
                  setSections({ ...sections, about: { ...sections.about, cards } });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-cream/50 outline-none h-24 resize-none font-arabic focus:border-neon/50 transition-all"
                placeholder="محتوى الكارت..." />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}