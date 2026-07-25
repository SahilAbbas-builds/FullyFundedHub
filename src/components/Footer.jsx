import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Globe2,
  ShieldCheck,
  Clock3,
  MessageSquare,
  MessageCircle,
  ArrowRight,
  Instagram,
  Check,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Manually verified',
    text: 'Every opportunity is reviewed by hand — official source and application link checked before it goes live.',
  },
  {
    icon: Clock3,
    title: 'Updated often',
    text: 'New scholarships and internships added a few times a week, not left to go stale.',
  },
  {
    icon: MessageSquare,
    title: 'Real replies',
    text: "Reach out any time — we personally respond to every message within a few days.",
  },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/fullyfundedhub01' },
  { icon: MessageCircle, label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029Vb8RJU01yT28RJJ6vF0L' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative border-t border-white/5 bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute -bottom-32 right-1/4 w-[380px] h-[380px] rounded-full bg-accent/10 blur-[110px]" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-10 border-b border-white/5"
        >
          {trustSignals.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass-card rounded-2xl p-5 flex gap-3.5 items-start">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-5 gap-10 py-14"
        >
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo-small.jpg" alt="FullyFundedHub logo" className="w-9 h-9 rounded-lg object-cover object-left" />
              <span className="font-heading text-xl font-bold">
                FullyFunded<span className="gradient-text">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
              Curated, fully funded scholarships and internships for students who want to
              study and work abroad. Real opportunities. Verified. No noise.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-sm">
              <label htmlFor="footer-newsletter" className="text-xs font-semibold text-foreground/80 mb-2 block">
                Get new opportunities in your inbox
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="footer-newsletter"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-premium !pl-10"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              <div className="h-5 mt-1.5">
                {error && <p className="text-xs text-destructive">{error}</p>}
                {subscribed && !error && (
                  <p className="text-xs text-primary">You're subscribed — welcome aboard.</p>
                )}
              </div>
            </form>

            <div className="flex items-center gap-2 mt-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold mb-4 text-foreground">Explore</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/opportunities" className="hover:text-primary transition-colors">Opportunities</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold mb-4 text-foreground">Submit</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Submit an opportunity</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Create account</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="legal-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="legal-link">Terms &amp; Conditions</Link></li>
              <li><Link to="/disclaimer" className="legal-link">Disclaimer</Link></li>
              <li><Link to="/cookie-policy" className="legal-link">Cookie Policy</Link></li>
            </ul>
          </div>
        </motion.div>

        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FullyFundedHub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5" /> Built by a student, for students.
          </p>
        </div>
      </div>
    </footer>
  );
}