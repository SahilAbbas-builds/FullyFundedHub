import { useState } from 'react';
import { supabase } from '@/api/supabaseClient';
import SEO from '@/components/SEO';
import { Mail, MessageSquare, Send, Lightbulb, CheckCircle2, Loader2 } from 'lucide-react';

export default function Contact() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="Contact — FullyFundedHub" description="Get in touch with FullyFundedHub or submit an opportunity for our team to review and verify." />
      <div className="text-center mb-10">
        <h1 className="font-heading text-4xl font-bold">Get in touch</h1>
        <p className="text-muted-foreground mt-2">Have a question or an opportunity to share? We'd love to hear from you.</p>
      </div>

      <div className="flex justify-center gap-2 mb-8 glass-card rounded-xl p-1.5 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'contact' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <MessageSquare className="w-4 h-4" /> Contact
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'submit' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Lightbulb className="w-4 h-4" /> Submit Opportunity
        </button>
      </div>

      {activeTab === 'contact' ? <ContactForm /> : <SubmitForm />}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('contact_leads').insert(form);
    setLoading(false);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  if (sent) {
    return <SuccessMessage title="Message sent!" desc="We'll get back to you within 2-3 business days." onReset={() => setSent(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
      <Field label="Your name">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-background/60 border border-white/10 outline-none text-sm focus:border-primary/40 transition-colors" placeholder="Jane Doe" />
      </Field>
      <Field label="Email">
        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-background/60 border border-white/10 outline-none text-sm focus:border-primary/40 transition-colors" placeholder="you@example.com" />
      </Field>
      <Field label="Message">
        <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-background/60 border border-white/10 outline-none text-sm focus:border-primary/40 transition-colors resize-none" placeholder="How can we help?" />
      </Field>
      <SubmitButton loading={loading} label="Send message" />
    </form>
  );
}

function SubmitForm() {
  const [form, setForm] = useState({
    title: '', organization: '', country: '', opportunity_type: 'Scholarship',
    degree_level: 'Masters', field_of_study: '', funding_type: 'Full',
    funding_amount: '', deadline: '', application_url: '',
    eligibility_criteria: '', description: '', submitter_name: '', submitter_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('submissions').insert(form);
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return <SuccessMessage title="Opportunity submitted!" desc="Thank you for contributing. Our team will review your submission and publish it if it meets our verification criteria." onReset={() => { setSent(false); setForm({ title: '', organization: '', country: '', opportunity_type: 'Scholarship', degree_level: 'Masters', field_of_study: '', funding_type: 'Full', funding_amount: '', deadline: '', application_url: '', eligibility_criteria: '', description: '', submitter_name: '', submitter_email: '' }); }} />;
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
      <p className="text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3">
        💡 Your submission goes into a <strong className="text-primary">pending review queue</strong>. It won't be published until our team verifies and approves it.
      </p>

      <Field label="Opportunity title">
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input-base" placeholder="e.g. DAAD Scholarship for Developing Countries" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Organization">
          <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="input-base" placeholder="e.g. DAAD" />
        </Field>
        <Field label="Country">
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-base" placeholder="e.g. Germany" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Type">
          <select value={form.opportunity_type} onChange={(e) => setForm({ ...form, opportunity_type: e.target.value })} className="input-base">
            <option>Scholarship</option><option>Internship</option>
          </select>
        </Field>
        <Field label="Degree level">
          <select value={form.degree_level} onChange={(e) => setForm({ ...form, degree_level: e.target.value })} className="input-base">
            <option>Undergraduate</option><option>Masters</option><option>PhD</option><option>All Levels</option>
          </select>
        </Field>
        <Field label="Funding">
          <select value={form.funding_type} onChange={(e) => setForm({ ...form, funding_type: e.target.value })} className="input-base">
            <option>Full</option><option>Partial</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Field of study">
          <input value={form.field_of_study} onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} className="input-base" placeholder="e.g. Engineering" />
        </Field>
        <Field label="Funding amount / coverage">
          <input value={form.funding_amount} onChange={(e) => setForm({ ...form, funding_amount: e.target.value })} className="input-base" placeholder="e.g. Full tuition + €934/month stipend" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Deadline">
          <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input-base" />
        </Field>
        <Field label="Official application URL">
          <input type="url" value={form.application_url} onChange={(e) => setForm({ ...form, application_url: e.target.value })} className="input-base" placeholder="https://" />
        </Field>
      </div>

      <Field label="Eligibility criteria (summary)">
        <textarea rows={3} value={form.eligibility_criteria} onChange={(e) => setForm({ ...form, eligibility_criteria: e.target.value })}
          className="input-base resize-none" placeholder="Brief overview of who can apply…" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your name">
          <input required value={form.submitter_name} onChange={(e) => setForm({ ...form, submitter_name: e.target.value })} className="input-base" placeholder="Jane Doe" />
        </Field>
        <Field label="Your email">
          <input required type="email" value={form.submitter_email} onChange={(e) => setForm({ ...form, submitter_email: e.target.value })} className="input-base" placeholder="you@example.com" />
        </Field>
      </div>

      <SubmitButton loading={loading} label="Submit for review" />
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button type="submit" disabled={loading}
      className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all gold-glow disabled:opacity-50">
      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> {label}</>}
    </button>
  );
}

function SuccessMessage({ title, desc, onReset }) {
  return (
    <div className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-accent" />
      </div>
      <h3 className="font-heading text-2xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
      <button onClick={onReset} className="mt-6 text-sm text-primary hover:underline">Send another</button>
    </div>
  );
}