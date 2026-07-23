import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

      <div className="relative flex justify-center gap-2 mb-8 glass-card rounded-xl p-1.5 max-w-md mx-auto">
        {[
          { key: 'contact', label: 'Contact', icon: MessageSquare },
          { key: 'submit', label: 'Submit Opportunity', icon: Lightbulb },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors z-10 ${
              activeTab === key ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {activeTab === key && (
              <motion.div
                layoutId="contactTabPill"
                className="absolute inset-0 bg-primary rounded-lg -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'contact' ? <ContactForm /> : <SubmitForm />}
        </motion.div>
      </AnimatePresence>
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
      <FloatingInput
        label="Your name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <FloatingInput
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Field label="Message">
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input-premium resize-none"
          placeholder="How can we help?"
        />
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
    return (
      <SuccessMessage
        title="Opportunity submitted!"
        desc="Thank you for contributing. Our team will review your submission and publish it if it meets our verification criteria."
        onReset={() => {
          setSent(false);
          setForm({ title: '', organization: '', country: '', opportunity_type: 'Scholarship', degree_level: 'Masters', field_of_study: '', funding_type: 'Full', funding_amount: '', deadline: '', application_url: '', eligibility_criteria: '', description: '', submitter_name: '', submitter_email: '' });
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
      <p className="text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3">
        💡 Your submission goes into a <strong className="text-primary">pending review queue</strong>. It won't be published until our team verifies and approves it.
      </p>

      <FloatingInput
        label="Opportunity title"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingInput label="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
        <FloatingInput label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Type">
          <select value={form.opportunity_type} onChange={(e) => setForm({ ...form, opportunity_type: e.target.value })} className="input-premium">
            <option>Scholarship</option><option>Internship</option>
          </select>
        </Field>
        <Field label="Degree level">
          <select value={form.degree_level} onChange={(e) => setForm({ ...form, degree_level: e.target.value })} className="input-premium">
            <option>Undergraduate</option><option>Masters</option><option>PhD</option><option>All Levels</option>
          </select>
        </Field>
        <Field label="Funding">
          <select value={form.funding_type} onChange={(e) => setForm({ ...form, funding_type: e.target.value })} className="input-premium">
            <option>Full</option><option>Partial</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingInput label="Field of study" value={form.field_of_study} onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} />
        <FloatingInput label="Funding amount / coverage" value={form.funding_amount} onChange={(e) => setForm({ ...form, funding_amount: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Deadline">
          <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input-premium" />
        </Field>
        <FloatingInput label="Official application URL" type="url" value={form.application_url} onChange={(e) => setForm({ ...form, application_url: e.target.value })} />
      </div>

      <Field label="Eligibility criteria (summary)">
        <textarea
          rows={3}
          value={form.eligibility_criteria}
          onChange={(e) => setForm({ ...form, eligibility_criteria: e.target.value })}
          className="input-premium resize-none"
          placeholder="Brief overview of who can apply…"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingInput label="Your name" required value={form.submitter_name} onChange={(e) => setForm({ ...form, submitter_name: e.target.value })} />
        <FloatingInput label="Your email" type="email" required value={form.submitter_email} onChange={(e) => setForm({ ...form, submitter_email: e.target.value })} />
      </div>

      <SubmitButton loading={loading} label="Submit for review" />
    </form>
  );
}

function FloatingInput({ label, type = 'text', required, value, onChange }) {
  return (
    <div className="relative">
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full px-4 pt-6 pb-2 rounded-xl bg-background/60 border border-white/10 outline-none text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
      />
      <label className="absolute left-4 top-1.5 text-xs text-primary transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary">
        {label}{required && <span className="text-accent"> *</span>}
      </label>
    </div>
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
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.01 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
    >
      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> {label}</>}
    </motion.button>
  );
}

function SuccessMessage({ title, desc, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
        className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle2 className="w-8 h-8 text-accent" />
      </motion.div>
      <h3 className="font-heading text-2xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
      <button onClick={onReset} className="mt-6 text-sm text-primary hover:underline">Send another</button>
    </motion.div>
  );
}
