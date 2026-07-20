import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Trash2, Inbox } from 'lucide-react';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ContactLead.list('-created_date', 100)
      .then((results) => { setLeads(results); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await base44.entities.ContactLead.delete(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold">Contact Leads</h2>
        <p className="text-sm text-muted-foreground">{leads.length} total submissions</p>
      </div>

      {loading ? (
        <div className="h-64 glass-card rounded-2xl animate-pulse" />
      ) : leads.length === 0 ? (
        <div className="glass-card rounded-2xl py-20 text-center">
          <Inbox className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{lead.name}</h3>
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Mail className="w-3 h-3" /> {lead.email}
                    </a>
                    <span className="text-xs text-muted-foreground">
                      {new Date(lead.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{lead.message}</p>
                </div>
                <button onClick={() => handleDelete(lead.id)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}