import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { Check, X, Mail, Globe, Calendar, Building2, Loader2 } from 'lucide-react';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!error) setSubmissions(data || []);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (sub) => {
    setActionLoading(sub.id);
    // Create a draft opportunity from the submission
    const { error: createError } = await supabase.from('opportunities').insert({
      title: sub.title,
      organization: sub.organization,
      country: sub.country,
      opportunity_type: sub.opportunity_type || 'Scholarship',
      degree_level: sub.degree_level || 'Masters',
      field_of_study: sub.field_of_study,
      funding_type: sub.funding_type || 'Full',
      funding_amount: sub.funding_amount,
      deadline: sub.deadline,
      application_url: sub.application_url,
      eligibility_criteria: sub.eligibility_criteria ? sub.eligibility_criteria.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      description: sub.description,
      status: 'draft',
    });
    if (!createError) {
      await supabase.from('submissions').update({ status: 'approved' }).eq('id', sub.id);
      setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
    } else {
      alert('Failed to approve submission.');
    }
    setActionLoading(null);
  };

  const handleReject = async (sub) => {
    setActionLoading(sub.id);
    await supabase.from('submissions').update({ status: 'rejected' }).eq('id', sub.id);
    setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
    setActionLoading(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold">Pending Submissions</h2>
        <p className="text-sm text-muted-foreground">Opportunities submitted by the community, awaiting your review.</p>
      </div>

      {loading ? (
        <div className="h-64 glass-card rounded-2xl animate-pulse" />
      ) : submissions.length === 0 ? (
        <div className="glass-card rounded-2xl py-20 text-center">
          <Mail className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No pending submissions. You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-lg font-bold">{sub.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    {sub.organization && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {sub.organization}</span>}
                    {sub.country && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {sub.country}</span>}
                    {sub.deadline && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(sub.deadline).toLocaleDateString()}</span>}
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{sub.opportunity_type}</span>
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-emerald-400">{sub.funding_type} funding</span>
                  </div>
                  {sub.description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{sub.description}</p>}
                  {sub.eligibility_criteria && (
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{sub.eligibility_criteria}</p>
                  )}
                  {sub.application_url && (
                    <a href={sub.application_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-primary hover:underline">
                      View application URL →
                    </a>
                  )}
                  <div className="mt-3 pt-3 border-t border-white/5 text-xs text-muted-foreground">
                    Submitted by <span className="text-foreground font-medium">{sub.submitter_name}</span> ({sub.submitter_email})
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(sub)}
                    disabled={actionLoading === sub.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-xs font-semibold hover:bg-accent/90 transition-all disabled:opacity-50"
                  >
                    {actionLoading === sub.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Approve → Draft
                  </button>
                  <button
                    onClick={() => handleReject(sub)}
                    disabled={actionLoading === sub.id}
                    className="flex items-center gap-1.5 px-4 py-2 border border-white/15 rounded-lg text-xs font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}