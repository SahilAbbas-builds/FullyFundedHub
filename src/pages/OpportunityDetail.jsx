import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import CountdownBadge, { getDaysUntil, getDeadlineStatus } from '@/components/CountdownBadge';
import SaveButton from '@/components/SaveButton';
import OpportunityCard from '@/components/OpportunityCard';
import SEO from '@/components/SEO';
import { Building2, MapPin, GraduationCap, Wallet, ExternalLink, CheckCircle2, ArrowLeft, Calendar, Clock, Lock, X } from 'lucide-react';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { user } = useCurrentUser();
  const [opp, setOpp] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const redirectPath = `/opportunities/${id}`;

  useEffect(() => {
    setLoading(true);
    const loadOpportunity = async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setOpp(data);
      setLoading(false);

      if (data.field_of_study) {
        const { data: relatedResults } = await supabase
          .from('opportunities')
          .select('*')
          .eq('status', 'published')
          .eq('field_of_study', data.field_of_study)
          .order('created_at', { ascending: false })
          .limit(4);

        setRelated((relatedResults || []).filter((r) => r.id !== id).slice(0, 3));
      }
    };

    loadOpportunity().catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="h-96 rounded-2xl glass-card animate-pulse" />
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Opportunity not found.</p>
        <Link to="/opportunities" className="mt-4 inline-block text-primary hover:underline">← Back to all opportunities</Link>
      </div>
    );
  }

  const flagUrl = opp.country_code ? `https://flagcdn.com/w80/${opp.country_code.toLowerCase()}.png` : null;
  const deadlineStatus = getDeadlineStatus(opp.deadline);
  const daysLeft = getDaysUntil(opp.deadline);

  return (
    <div>
      <SEO title={`${opp.title} — FullyFundedHub`} description={opp.description || `${opp.opportunity_type} at ${opp.organization || 'various organizations'} in ${opp.country || 'multiple countries'}. ${opp.funding_type} funding available.`} />

      {/* Auth prompt modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowAuthPrompt(false)}>
          <div className="glass-card rounded-2xl p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAuthPrompt(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-center">Log in to apply</h3>
            <p className="text-muted-foreground text-center mt-3 leading-relaxed text-sm">
              You need a free account to access application links. Log in or sign up — we'll bring you right back to this opportunity.
            </p>
            <div className="mt-6 space-y-3">
              <Link to={`/login?next=${encodeURIComponent(redirectPath)}`} className="block w-full px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold text-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                Log in
              </Link>
              <Link to={`/register?next=${encodeURIComponent(redirectPath)}`} className="block w-full px-5 py-3 border border-white/15 rounded-xl text-sm font-semibold text-center hover:bg-white/5 transition-all">
                Create free account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero header */}
      <div className="relative border-b border-white/5 bg-card/30 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/opportunities" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All opportunities
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              opp.opportunity_type === 'Scholarship' ? 'bg-primary/15 text-primary border-primary/30' : 'bg-accent/15 text-emerald-400 border-accent/30'
            }`}>{opp.opportunity_type}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              opp.funding_type === 'Full' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>{opp.funding_type} Funding</span>
            {opp.is_featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-primary/15 text-primary border-primary/30">★ Featured</span>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{opp.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {opp.organization && (
              <span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {opp.organization}</span>
            )}
            {opp.country && (
              <span className="flex items-center gap-2">
                {flagUrl && <img src={flagUrl} alt={opp.country} className="w-5 h-4 rounded-sm" />}
                {opp.country}
              </span>
            )}
            {opp.degree_level && (
              <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {opp.degree_level}</span>
            )}
            {opp.field_of_study && (
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {opp.field_of_study}</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deadline banner */}
            <div className={`glass-card rounded-2xl p-6 border-l-4 ${
              deadlineStatus.tone === 'urgent' ? 'border-l-destructive' :
              deadlineStatus.tone === 'approaching' ? 'border-l-amber-500' :
              'border-l-accent'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5" /> Application Deadline
                  </div>
                  <p className="font-heading text-2xl font-bold">
                    {opp.deadline ? new Date(opp.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : (opp.deadline_note || 'Rolling')}
                  </p>
                </div>
                <div className="text-right">
                  {daysLeft !== null && daysLeft >= 0 && (
                    <>
                      <div className={`font-heading text-3xl font-bold ${
                        deadlineStatus.tone === 'urgent' ? 'text-destructive' :
                        deadlineStatus.tone === 'approaching' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{daysLeft}</div>
                      <div className="text-xs text-muted-foreground">days remaining</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {opp.description && (
              <div>
                <h2 className="font-heading text-xl font-bold mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{opp.description}</p>
              </div>
            )}

            {/* Eligibility */}
            {opp.eligibility_criteria && opp.eligibility_criteria.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-bold mb-4">Eligibility Criteria</h2>
                <ul className="space-y-3">
                  {opp.eligibility_criteria.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 glass-card rounded-xl p-3.5">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Funding details */}
            {opp.funding_amount && (
              <div>
                <h2 className="font-heading text-xl font-bold mb-3">Funding Details</h2>
                <div className="glass-card rounded-xl p-5 flex items-start gap-3">
                  <Wallet className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{opp.funding_type} Funding</p>
                    <p className="text-sm text-muted-foreground mt-1">{opp.funding_amount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 lg:sticky lg:top-20">
              <div className="flex items-center justify-between mb-4">
                <CountdownBadge deadline={opp.deadline} deadlineNote={opp.deadline_note} />
                <SaveButton opportunityId={opp.id} />
              </div>

              {opp.application_url && (
                <button
                  onClick={() => {
                    if (user) {
                      window.open(opp.application_url, '_blank', 'noopener,noreferrer');
                    } else {
                      setShowAuthPrompt(true);
                    }
                  }}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </button>
              )}
              <p className="text-xs text-muted-foreground mt-3 text-center">
                You'll be redirected to the official application page.
              </p>

              <div className="mt-6 pt-6 border-t border-white/5 space-y-3 text-sm">
                {opp.organization && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Organization</span>
                    <span className="font-medium text-right">{opp.organization}</span>
                  </div>
                )}
                {opp.country && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium">{opp.country}</span>
                  </div>
                )}
                {opp.degree_level && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{opp.degree_level}</span>
                  </div>
                )}
                {opp.field_of_study && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Field</span>
                    <span className="font-medium text-right">{opp.field_of_study}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold mb-6">Related opportunities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => <OpportunityCard key={r.id} opportunity={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



