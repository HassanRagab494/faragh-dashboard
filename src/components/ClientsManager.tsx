import { motion } from "motion/react";
import { Users, Mail, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL, authHeaders } from "../api";

interface Client {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/contact`, { headers: authHeaders() })
      .then(res => res.json())
      .then(setClients);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-arabic neon-text">رسائل العملاء</h2>
          <p className="text-cream/40 text-sm">الرسائل الواردة من الموقع</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.length === 0 && (
          <div className="col-span-3 glass-card flex items-center justify-center h-40">
            <p className="font-arabic text-cream/40">لا توجد رسائل بعد</p>
          </div>
        )}
        {clients.map((client, i) => (
          <motion.div
            key={client._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card hover:border-white/20 transition-all group overflow-hidden"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neon border border-white/10 group-hover:neon-glow transition-all">
                <Users size={24} />
              </div>
              <button className="text-cream/20 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-bold font-arabic">{client.name}</h3>
              <div className="flex items-center gap-2 text-cream/40 text-xs">
                <Mail size={12} />
                <span>{client.email}</span>
              </div>
            </div>

            {client.subject && (
              <p className="text-xs text-neon/70 mb-2 font-arabic">{client.subject}</p>
            )}
            <p className="text-sm text-cream/50 font-arabic line-clamp-2">{client.message}</p>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[10px] text-cream/30">
                {new Date(client.createdAt).toLocaleDateString('ar-EG')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}