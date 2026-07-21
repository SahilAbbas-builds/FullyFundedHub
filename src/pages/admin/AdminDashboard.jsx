import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { Briefcase, Inbox, Users, Heart, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ live: 0, pending: 0, users: 0, drafts: 0 });
  const [topSaved, setTopSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const [liveRes, pendingRes, usersRes, draftsRes, savesRes] = await Promise.all([
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('saved_opportunities').select('opportunity_id, opportunities(*)').limit(500),
      ]);

      const saves = savesRes.data || [];
      const counts = {};
      const oppMap = {};
      saves.forEach((s) => {
        if (s.opportunity_id) {
          counts[s.opportunity_id] = (counts[s.opportunity_id] || 0) + 1;
          if (s.opportunities) oppMap[s.opportunity_id] = s.opportunities;
        }
      });
      const topSavedList = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => (oppMap[id] ? { ...oppMap[id], saveCount: count } : null))
        .filter(Boolean);

      setStats({
        live: liveRes.count || 0,
        pending: pendingRes.count || 0,
        users: usersRes.count || 0,
        drafts: draftsRes.count || 0,
      });
      setTopSaved(topSavedList);
      setLoading(false);
    };

    loadStats().catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Live Listings', value: stats.live, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-accent/15' },
    { label: 'Pending Submissions', value: stats.pending, icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { label: 'Draft Listings', value: stats.drafts, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/15' },
    { label: 'Registered Users', value: stats.users, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Overview</h2>
        <p className="text-sm text-muted-foreground">Platform statistics at a glance.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 glass-card rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="font-heading text-3xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most saved */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg font-bold">Most Saved Opportunities</h3>
          </div>
          {topSaved.length > 0 ? (
            <div className="space-y-3">
              {topSaved.map((opp, i) => (
                <Link key={opp.id} to={`/admin/opportunities`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{opp.title}</p>
                    <p className="text-xs text-muted-foreground">{opp.organization} · {opp.country}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <Heart className="w-3.5 h-3.5 fill-primary" /> {opp.saveCount}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">No saved opportunities yet.</p>
          )}
        </div>

        {/* Quick actions */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-heading text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/admin/opportunities/new" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
              <span className="flex items-center gap-3 text-sm font-medium"><Plus className="w-4 h-4 text-primary" /> Add new opportunity</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link to="/admin/submissions" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
              <span className="flex items-center gap-3 text-sm font-medium"><Inbox className="w-4 h-4 text-amber-400" /> Review submissions {stats.pending > 0 && <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">{stats.pending}</span>}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link to="/admin/blog" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
              <span className="flex items-center gap-3 text-sm font-medium"><TrendingUp className="w-4 h-4 text-accent" /> Write a blog post</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}