import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { parseBulkText } from '@/lib/bulkImportParser';
import { ArrowLeft, Wand2, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminBulkImport() {
  const navigate = useNavigate();
  const [raw, setRaw] = useState('');
  const [parsed, setParsed] = useState([]);
  const [included, setIncluded] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleParse = () => {
    setError('');
    try {
      const results = parseBulkText(raw);
      if (results.length === 0) {
        setError('No opportunities found. Separate each entry with a line containing only ---');
        return;
      }
      setParsed(results);
      const inc = {};
      results.forEach((_, i) => { inc[i] = true; });
      setIncluded(inc);
    } catch (err) {
      setError('Could not parse the pasted text. Check the format and try again.');
    }
  };

  const updateField = (index, key, value) => {
    setParsed((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const handleImport = async () => {
    const toInsert = parsed.filter((_, i) => included[i]).map(({ deadlineRawText, ...rest }) => rest);
    if (toInsert.length === 0) return;
    setSaving(true);
    try {
      const { error: insertError } = await supabase.from('opportunities').insert(toInsert);
      if (insertError) throw insertError;
      navigate('/admin/opportunities');
    } catch (err) {
      setError('Import failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const includedCount = Object.values(included).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate('/admin/opportunities')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <h2 className="font-heading text-2xl font-bold mb-2">Bulk Import Opportunities</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Paste multiple opportunities below, each separated by a line containing only <code className="px-1 py-0.5 rounded bg-white/10 text-xs">---</code>. All imported opportunities are saved as drafts for you to review before publishing.
      </p>

      {parsed.length === 0 ? (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <textarea
            rows={16}
            className="input-base resize-none font-mono text-xs"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={'1. Opportunity Title\nOrganization: ...\nCountry: ...\n...\n\n---\n\n2. Next Opportunity Title\n...'}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            onClick={handleParse}
            disabled={!raw.trim()}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4" /> Parse Opportunities
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{parsed.length} opportunities parsed &middot; {includedCount} selected</p>
            <button onClick={() => { setParsed([]); setRaw(''); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Start over
            </button>
          </div>

          <div className="space-y-3">
            {parsed.map((opp, i) => (
              <div key={i} className={`glass-card rounded-2xl p-4 transition-opacity ${included[i] ? '' : 'opacity-40'}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!included[i]}
                    onChange={(e) => setIncluded((prev) => ({ ...prev, [i]: e.target.checked }))}
                    className="mt-1.5"
                  />
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block text-xs text-muted-foreground mb-1">Title</label>
                      <input className="input-base" value={opp.title} onChange={(e) => updateField(i, 'title', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Organization</label>
                      <input className="input-base" value={opp.organization} onChange={(e) => updateField(i, 'organization', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Country</label>
                      <input className="input-base" value={opp.country} onChange={(e) => updateField(i, 'country', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Type</label>
                      <select className="input-base" value={opp.opportunity_type} onChange={(e) => updateField(i, 'opportunity_type', e.target.value)}>
                        <option>Scholarship</option><option>Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Degree</label>
                      <select className="input-base" value={opp.degree_level} onChange={(e) => updateField(i, 'degree_level', e.target.value)}>
                        <option>Undergraduate</option><option>Masters</option><option>PhD</option><option>All Levels</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Funding</label>
                      <select className="input-base" value={opp.funding_type} onChange={(e) => updateField(i, 'funding_type', e.target.value)}>
                        <option>Full</option><option>Partial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Deadline</label>
                      <input type="date" className="input-base" value={opp.deadline} onChange={(e) => updateField(i, 'deadline', e.target.value)} />
                      {!opp.deadline && opp.deadlineRawText && (
                        <p className="text-xs text-amber-400 mt-1">From text: "{opp.deadlineRawText}"</p>
                      )}
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block text-xs text-muted-foreground mb-1">Application URL</label>
                      <input className="input-base" value={opp.application_url} onChange={(e) => updateField(i, 'application_url', e.target.value)} />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block text-xs text-muted-foreground mb-1">Description</label>
                      <textarea rows={4} className="input-base resize-none text-xs" value={opp.description} onChange={(e) => updateField(i, 'description', e.target.value)} />
                    </div>
                  </div>
                  {opp.deadline ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1.5 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-amber-400 mt-1.5 flex-shrink-0" title="No deadline parsed - check manually" />}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            onClick={handleImport}
            disabled={saving || includedCount === 0}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Import {includedCount} as Draft{includedCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}




