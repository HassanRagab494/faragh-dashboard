export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: string[];
}

export interface Reason {
  id: string;
  title: string;
  desc: string;
}

export interface Value {
  id: string;
  title: string;
  desc: string;
}
export interface SiteSections {
  hero: { title: string; subTitle: string; cta: string };
  about: {
    title: string;
    subTitle: string;
    cards: { icon: string; title: string; content: string }[];
  };
  services: Service[];
  servicesSection: { title: string; subTitle: string };
  teamSection: { title: string; subTitle: string };
  statsSection: { title: string; subTitle: string };
  stats: { clientSatisfaction: number; successfulProjects: number; support24h: boolean };
  contact: { whatsapp: string; email: string; instagram: string };
  whyUs: { title: string; subTitle: string; reasons: Reason[] };
  values: { title: string; subTitle: string; items: Value[] };
  goals: { title: string; subTitle: string; items: Value[] };
  portfolioSection: { title: string; subTitle: string }; // ✅ جديد
}