import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { Loader2, Save, Send, Sparkles, ArrowLeft } from 'lucide-react';

const emptyForm = {
  title: '', organization: '', country: '', country_code: '',
  opportunity_type: 'Scholarship', degree_level: 'Masters', field_of_study: '',
  funding_type: 'Full', funding_amount: '', deadline: '', application_url: '',
  eligibility_criteria: [], raw_notes: '', description: '', is_featured: false,
  status: 'draft',
};

export default function AdminOpportunityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [eligibilityText, setEligibilityText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load existing if editing
  useEffect(() => {
    if (id) {
      supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setForm({ ...emptyForm, ...data });
            setEligibilityText((data.eligibility_criteria || []).join('\n'));
          }
          setLoaded(true);
        });
    } else {
      setLoaded(true);
    }
  }, [id]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleAiFormat = () => {
    // TODO: AI-assisted formatting was previously powered by Base44's LLM
    // integration. Not yet reconnected post-migration — needs a backend
    // (e.g. a Supabase Edge Function) to call an LLM API without exposing
    // a key client-side. For now, enter eligibility criteria manually below.
    alert('AI Format is temporarily unavailable — please enter eligibility criteria manually for now.');
  };

  const handleSave = async (publish = false) => {
    setLoading(true);
    const criteriaArray = eligibilityText.split('\n').map((s) => s.trim()).filter(Boolean);
    const { id: _id, created_at, updated_at, ...rest } = form;
    const payload = { ...rest, eligibility_criteria: criteriaArray, status: publish ? 'published' : 'draft' };
    try {
      if (id) {
        const { error } = await supabase.from('opportunities').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('opportunities').insert(payload);
        if (error) throw error;
      }
      navigate('/admin/opportunities');
    } catch (err) {
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return <div className="h-64 glass-card rounded-2xl animate-pulse" />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/admin/opportunities')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <h2 className="font-heading text-2xl font-bold mb-6">{id ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        <FormField label="Title" required>
          <input className="input-base" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Chevening Scholarship 2026" />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Organization">
            <input className="input-base" value={form.organization} onChange={(e) => update('organization', e.target.value)} placeholder="e.g. UK Government" />
          </FormField>
          <FormField label="Country">
            <input className="input-base" value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="e.g. United Kingdom" />
          </FormField>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <FormField label="Type">
            <select className="input-base" value={form.opportunity_type} onChange={(e) => update('opportunity_type', e.target.value)}>
              <option>Scholarship</option><option>Internship</option>
            </select>
          </FormField>
          <FormField label="Degree">
            <select className="input-base" value={form.degree_level} onChange={(e) => update('degree_level', e.target.value)}>
              <option>Undergraduate</option><option>Masters</option><option>PhD</option><option>All Levels</option>
            </select>
          </FormField>
          <FormField label="Funding">
            <select className="input-base" value={form.funding_type} onChange={(e) => update('funding_type', e.target.value)}>
              <option>Full</option><option>Partial</option>
            </select>
          </FormField>
          <FormField label="Featured?">
            <select className="input-base" value={form.is_featured ? 'yes' : 'no'} onChange={(e) => update('is_featured', e.target.value === 'yes')}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Field of study">
            <input className="input-base" value={form.field_of_study} onChange={(e) => update('field_of_study', e.target.value)} placeholder="e.g. Any field" />
          </FormField>
          <FormField label="Country code (ISO 2-letter, for flag)">
            <input className="input-base" value={form.country_code} onChange={(e) => update('country_code', e.target.value)} placeholder="e.g. GB" maxLength={2} />
          </FormField>
        </div>

        <FormField label="Funding amount / coverage">
          <input className="input-base" value={form.funding_amount} onChange={(e) => update('funding_amount', e.target.value)} placeholder="e.g. Full tuition + £18,000 stipend" />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Deadline">
            <input type="date" className="input-base" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
          </FormField>
          <FormField label="Official application URL">
            <input type="url" className="input-base" value={form.application_url} onChange={(e) => update('application_url', e.target.value)} placeholder="https://" />
          </FormField>
        </div>

        <FormField label="Description / Overview">
          <textarea rows={3} className="input-base resize-none" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Brief overview of the opportunity…" />
        </FormField>

        {/* Raw Notes + AI Format */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold">Raw Notes</label>
              <p className="text-xs text-muted-foreground">Paste unstructured details copied from the official source.</p>
            </div>
            <button
              onClick={handleAiFormat}
              disabled={!form.raw_notes.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 whitespace-nowrap"
              title="AI formatting is temporarily unavailable post-migration"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Format
            </button>
          </div>
          <textarea
            rows={6}
            className="input-base resize-none font-mono text-xs"
            value={form.raw_notes}
            onChange={(e) => update('raw_notes', e.target.value)}
            placeholder="Paste raw, unstructured text from the official source here…"
          />
        </div>

        <FormField label="Eligibility Criteria (one per line)">
          <textarea
            rows={6}
            className="input-base resize-none"
            value={eligibilityText}
            onChange={(e) => setEligibilityText(e.target.value)}
            placeholder="Each line becomes a bullet point."
          />
        </FormField>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/15 text-sm font-semibold hover:bg-white/5 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save as Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all gold-glow disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}{required && <span className="text-primary ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}