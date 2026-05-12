import { Grid2X2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SiteSections } from "./types";

interface Props {
  sections: SiteSections;
  setSections: (s: SiteSections) => void;
}

export function PortfolioStudio({ sections, setSections }: Props) {
  return (
    <div className="glass-card lg:col-span-2 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Grid2X2 size={20} /></div>
        <h3 className="font-bold font-arabic">عناوين قسم الأعمال</h3>
      </div>
      <SectionHeader
        title={sections.portfolioSection.title}
        subTitle={sections.portfolioSection.subTitle}
        onChange={(field, value) => setSections({ ...sections, portfolioSection: { ...sections.portfolioSection, [field]: value } })}
      />
    </div>
  );
}