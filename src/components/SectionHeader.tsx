interface Props {
  title: string;
  subTitle: string;
  onChange: (field: "title" | "subTitle", value: string) => void;
}

export function SectionHeader({ title, subTitle, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/3 border border-white/10 mb-4">
      <div>
        <label className="text-xs text-cream/40 font-arabic block mb-2">عنوان القسم (Bold)</label>
        <input
          type="text"
          value={title}
          onChange={e => onChange("title", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold focus:border-neon/50 outline-none transition-all"
          placeholder="عنوان القسم..."
        />
      </div>
      <div>
        <label className="text-xs text-cream/40 font-arabic block mb-2">وصف القسم (Medium)</label>
        <input
          type="text"
          value={subTitle}
          onChange={e => onChange("subTitle", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-medium focus:border-neon/50 outline-none transition-all"
          placeholder="وصف القسم..."
        />
      </div>
    </div>
  );
}