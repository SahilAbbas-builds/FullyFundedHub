import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import HeroBackground from '@/components/HeroBackground';
import OpportunityCard from '@/components/OpportunityCard';
import SEO from '@/components/SEO';
import { Search, ArrowRight, ShieldCheck, RefreshCw, Mail, Compass, FileCheck, Send, Loader2 } from 'lucide-react';

export default function Home() {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.Opportunity.filter({ status: 'published', is_featured: true }, '-created_date', 4)
      .then(async (results) => {
        if (results.length === 0) {
          const fallback = await base44.entities.Opportunity.filter({ status: 'published' }, '-created_date', 4);
          setFeatured(fallback);
        } else {
          setFeatured(results);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/opportunities?q=${encodeURIComponent(search)}`);
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterError('');
    try {
      await base44.entities.NewsletterSignup.create({ email: newsletterEmail });
      setNewsletterSent(true);
      setNewsletterEmail('');
    } catch {
      setNewsletterError('Something went wrong. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const stats = [
    { value: '150+', label: 'Verified opportunities' },
    { value: '40+', label: 'Countries covered' },
    { value: 'Weekly', label: 'Updated regularly' },
    { value: '100%', label: 'Free to browse' },
  ];

  const steps = [
    { icon: Compass, title: 'Discover', desc: 'Search and filter through verified scholarships and internships tailored to your goals.', accent: 'primary' },
    { icon: FileCheck, title: 'Verify', desc: 'Every listing is checked by our team — real deadlines, real funding, real eligibility.', accent: 'accent' },
    { icon: Send, title: 'Apply', desc: 'Click through to the official application and track your deadlines in your dashboard.', accent: 'primary' },
  ];

  return (
    <div className="overflow-hidden">
      <SEO title="FullyFundedHub — Verified Scholarships & Internships" description="Curated, fully funded scholarships and internships for students who want to study and work abroad. Every listing is manually verified. No noise." />

      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-4">
        <HeroBackground />
        <div className="relative z-10 max-w-4xl mx-auto text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium text-primary mb-8 animate-fade-in">
            <ShieldCheck className="w-3.5 h-3.5" />
            Every listing is manually verified
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight animate-fade-up">
            Real opportunities.
            <br />
            <span className="gradient-text">Verified.</span> No noise.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Curated, fully funded scholarships and internships for students who want to study and work abroad.
          </p>

          <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative glass-card rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-black/40">
              <Search className="w-5 h-5 text-muted-foreground ml-3 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keyword, country, or field…"
                className="flex-1 bg-transparent border-0 outline-none text-sm py-2.5 placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 gold-glow"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {['Scholarships', 'Internships', 'Fully Funded', 'Masters', 'PhD'].map((tag) => (
              <Link
                key={tag}
                to={`/opportunities?q=${encodeURIComponent(tag)}`}
                className="px-4 py-1.5 rounded-full glass-card text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Trending opportunities</h2>
            <p className="text-muted-foreground mt-2">Hand-picked listings with deadlines approaching soon.</p>
          </div>
          <Link to="/opportunities" className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl glass-card animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">No featured opportunities yet — check back soon.</p>
        )}

        <div className="sm:hidden mt-8">
          <Link to="/opportunities" className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface-1 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">How it works</h2>
            <p className="text-muted-foreground mt-2">Three simple steps to your next opportunity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2 ${step.accent === 'accent' ? 'bg-accent/10' : 'bg-primary/10'}`}>
                  <step.icon className={`w-7 h-7 ${step.accent === 'accent' ? 'text-accent' : 'text-primary'}`} />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass-card rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/15 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/15 blur-[100px]" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Get new opportunities in your inbox</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Join thousands of students. We send curated, verified listings weekly — no spam, ever.
            </p>
            {newsletterSent ? (
              <div className="mt-8 max-w-md mx-auto p-4 rounded-xl bg-accent/15 text-emerald-400 text-sm font-medium">
                ✓ You're subscribed! Watch your inbox for the next batch.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-8 max-w-md mx-auto">
                {newsletterError && (
                  <p className="text-destructive text-sm mb-3 text-center">{newsletterError}</p>
                )}
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 px-4 py-3 rounded-xl bg-background/60 border border-white/10 outline-none text-sm focus:border-primary/50 transition-colors"
                  />
                  <button type="submit" disabled={newsletterLoading} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all gold-glow disabled:opacity-50 flex items-center gap-2">
                    {newsletterLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing…</> : 'Subscribe'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}