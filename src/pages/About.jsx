import { ShieldCheck, Users, Globe2, Heart, Eye, Search, BadgeCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const values = [
    { icon: ShieldCheck, title: 'Verified Only', desc: 'Every listing is manually checked before it goes live — real deadlines, real funding, real eligibility.', accent: 'primary' },
    { icon: Eye, title: 'No Noise', desc: 'We curate, not aggregate. You get a focused list of genuine opportunities, not hundreds of irrelevant posts.', accent: 'accent' },
    { icon: Heart, title: 'Student-First', desc: 'Built by a student who went through the grind. No paywalls, no premium tiers, no gatekeeping.', accent: 'primary' },
    { icon: Globe2, title: 'Global Reach', desc: 'Opportunities from every continent — because talent has no borders.', accent: 'accent' },
  ];

  const verificationSteps = [
    { step: 'Source', desc: 'We discover opportunities from official university, government, and organization websites.' },
    { step: 'Verify', desc: 'Each listing is checked for: active deadline, confirmed funding, legitimate organization, and correct eligibility.' },
    { step: 'Format', desc: 'We structure the details into clean, scannable eligibility criteria and funding summaries.' },
    { step: 'Publish', desc: 'Only after verification does a listing appear on the platform with a green verified badge.' },
  ];

  return (
    <div>
      <SEO title="About Us — Why We Manually Verify Every Listing" description="FullyFundedHub started as a personal spreadsheet after one too many dead links and expired deadlines. Here's how — and why — we verify every listing by hand." />

      {/* Hero */}
      <section className="relative border-b border-white/5 bg-surface-1 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-accent/10 blur-[100px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Our Story</span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-3">
              Built by a student,<br /><span className="gradient-text">for students.</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 leading-relaxed max-w-2xl mx-auto">
              FullyFundedHub started as a personal spreadsheet. After spending hundreds of hours hunting for fully funded scholarships and internships — only to find dead links, expired deadlines, and half-true funding claims — we decided to build the platform we wished existed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${v.accent === 'accent' ? 'bg-accent/10' : 'bg-primary/10'}`}>
                  <v.icon className={`w-6 h-6 ${v.accent === 'accent' ? 'text-accent' : 'text-primary'}`} />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Verification process */}
      <section className="bg-surface-1 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Trust & Verification</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3">How we verify every listing</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">No listing goes live without passing through this four-step process.</p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {verificationSteps.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="glass-card rounded-2xl p-6 flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-background font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold">{item.step}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <BadgeCheck className="w-5 h-5 text-accent flex-shrink-0 ml-auto" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Reveal>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold">Ready to find your next opportunity?</h2>
          <p className="text-muted-foreground mt-3">Browse our full list of verified, fully funded scholarships and internships.</p>
          <Link to="/opportunities" className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
            Explore opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}

