import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { getDaysUntil, getDeadlineStatus } from '@/components/CountdownBadge';
import { Plus, Pencil, Trash2, Archive, Loader2 } from 'lucide-react';

export default function AdminOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = () => {
    setLoading(true);
    supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (!error) setOpportunities(data || []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this opportunity permanently?')) return;
    await supabase.from('opportunities').delete().eq('id', id);
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  const handleMarkInactive = async (id) => {
    await supabase.from('opportunities').update({ status: 'inactive' }).eq('id', id);
    setOpportunities((prev) => prev.map((o) => o.id === id ? { ...o, status: 'inactive' } : o));
  };

  const handleBulkExpire = async () => {
    const expired = opportunities.filter((o) => {
      const d = getDaysUntil(o.deadline);
      return d !== null && d < 0 && o.status !== 'inactive';
    });
    if (expired.length === 0) {
      alert('No expired listings to mark inactive.');
      return;
    }
    if (!confirm(`Mark ${expired.length} expired listing(s) as inactive?`)) return;
    setBulkLoading(true);
    await Promise.all(
      expired.map((o) => supabase.from('opportunities').update({ status: 'inactive' }).eq('id', o.id))
    );
    load();
    setBulkLoading(false);
  };

  const statusBadge = (status) => {
    const styles = {
      published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      draft: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      inactive: 'bg-muted text-muted-foreground border-border',
    };
    return styles[status] || styles.draft;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">Manage Listings</h2>
          <p className="text-sm text-muted-foreground">{opportunities.length} total listings</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBulkExpire}
            disabled={bulkLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-sm font-medium hover:bg-white/5 transition-all disabled:opacity-50"
          >
            {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
            Expire old
          </button>
          <Link to="/admin/opportunities/new" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" /> Add New
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="h-64 glass-card rounded-2xl animate-pulse" />
      ) : opportunities.length === 0 ? (
        <div className="glass-card rounded-2xl py-20 text-center">
          <p className="text-muted-foreground">No listings yet.</p>
          <Link to="/admin/opportunities/new" className="mt-4 inline-block text-primary hover:underline text-sm">Create your first listing</Link>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Title</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Type</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Deadline</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => {
                  const dStatus = getDeadlineStatus(opp.deadline);
                  return (
                    <tr key={opp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium">{opp.title}</div>
                        <div className="text-xs text-muted-foreground">{opp.organization} · {opp.country}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${opp.opportunity_type === 'Scholarship' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/10 text-emerald-400 border-accent/20'}`}>
                          {opp.opportunity_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusBadge(opp.status)}`}>{opp.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {opp.deadline ? (
                          <div>
                            <div className="text-xs">{new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <span className={`text-xs font-medium ${dStatus.tone === 'urgent' ? 'text-destructive' : dStatus.tone === 'approaching' ? 'text-amber-400' : dStatus.tone === 'expired' ? 'text-muted-foreground' : 'text-emerald-400'}`}>
                              {dStatus.label}
                            </span>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/opportunities/${opp.id}/edit`} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          {opp.status !== 'inactive' && (
                            <button onClick={() => handleMarkInactive(opp.id)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-amber-400 transition-colors" title="Mark inactive">
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(opp.id)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}