import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/api/supabaseClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import OpportunityCard from '@/components/OpportunityCard';
import { getDaysUntil } from '@/components/CountdownBadge';
import SEO from '@/components/SEO';
import { Bookmark, Trash2, Calendar, AlertTriangle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useCurrentUser();
  const [saved, setSaved] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    const loadSaved = async () => {
      const { data: savedRecords } = await supabase
        .from('saved_opportunities')
        .select('*, opportunities(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      const records = savedRecords || [];
      setSaved(records);
      setOpportunities(records.map((r) => r.opportunities).filter(Boolean));
      setDataLoading(false);
    };

    loadSaved().catch(() => setDataLoading(false));
  }, [user]);

  const sortedOpps = useMemo(() => {
    return [...opportunities].sort((a, b) => {
      const da = a.deadline ? getDaysUntil(a.deadline) : 9999;
      const db = b.deadline ? getDaysUntil(b.deadline) : 9999;
      return da - db;
    });
  }, [opportunities]);

  const handleRemove = async (oppId) => {
    const savedRecord = saved.find((s) => s.opportunity_id === oppId);
    if (!savedRecord) return;
    await supabase.from('saved_opportunities').delete().eq('id', savedRecord.id);
    setSaved((prev) => prev.filter((s) => s.id !== savedRecord.id));
    setOpportunities((prev) => prev.filter((o) => o.id !== oppId));
  };

  if (loading || dataLoading) {
    return (
      <>
        <SEO title="Dashboard — FullyFundedHub" description="Your saved opportunities and deadlines." noindex />
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="h-64 rounded-2xl glass-card animate-pulse" />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SEO title="Dashboard — FullyFundedHub" description="Log in to view your saved opportunities and deadlines." noindex />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <Bookmark className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold">Log in to view your dashboard</h2>
          <p className="text-muted-foreground mt-2 text-sm">Save opportunities and track deadlines in one place.</p>
          <Link to="/login" className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Log in</Link>
        </div>
      </>
    );
  }

  const upcoming = sortedOpps.filter((o) => {
    const d = getDaysUntil(o.deadline);
    return d !== null && d >= 0 && d <= 14;
  });

  return (
    <>
    <SEO title="Dashboard — FullyFundedHub" description="Your saved opportunities, sorted by deadline urgency." noindex />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1 className="font-heading text-4xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground mt-2">Your saved opportunities, sorted by deadline urgency.</p>
      </motion.div>

      {upcoming.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-2xl p-5 mb-8 border-l-4 border-l-amber-500"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-amber-400">Upcoming deadlines ({upcoming.length})</h3>
          </div>
          <div className="space-y-2">
            {upcoming.map((opp) => {
              const days = getDaysUntil(opp.deadline);
              return (
                <div key={opp.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link to={`/opportunities/${opp.id}`} className="hover:text-primary transition-colors truncate">{opp.title}</Link>
                  <span className={`font-semibold whitespace-nowrap ${days <= 7 ? 'text-destructive' : 'text-amber-400'}`}>
                    {days === 0 ? 'Today!' : `${days} day${days === 1 ? '' : 's'} left`}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {sortedOpps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedOpps.map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              <OpportunityCard opportunity={opp} />
              <button
                onClick={() => handleRemove(opp.id)}
                className="absolute top-2 right-12 z-10 w-9 h-9 rounded-full bg-background/80 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Remove from saved"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl py-20 text-center">
          <Bookmark className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold">No saved opportunities yet</h3>
          <p className="text-muted-foreground mt-2 text-sm">Tap the heart icon on any listing to save it here.</p>
          <Link to="/opportunities" className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Browse opportunities</Link>
        </div>
      )}
    </div>
    </>
  );
}
