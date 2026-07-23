import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is FullyFundedHub free to use?',
    a: 'Yes — FullyFundedHub is completely free to use. You can browse all verified scholarships and internships, create an account, save opportunities, and subscribe to our newsletter without paying anything. We will never charge students to access listings.'
  },
  {
    q: 'How do you verify listings?',
    a: 'Every listing is manually checked by our team before it is published. We verify that the application link is live, the deadline is current, the funding amount is accurate, and the eligibility criteria are real. We do not auto-publish listings — each one goes through a human review process.'
  },
  {
    q: 'Can I submit an opportunity?',
    a: 'Yes! If you know about a scholarship or internship that should be listed, you can submit it through our Contact page. Select "Submit an opportunity," fill in the details, and our team will review and verify it before publishing.'
  },
  {
    q: 'How often are new opportunities added?',
    a: 'We add new opportunities regularly — typically on a weekly basis. The best way to stay updated is to subscribe to our newsletter, which sends curated new listings directly to your inbox.'
  },
  {
    q: "Do you guarantee I'll get accepted?",
    a: 'No. FullyFundedHub provides verified information about opportunities — we do not influence or guarantee application outcomes. Acceptance decisions are made solely by the organizations offering each scholarship or internship. We give you the best possible information to apply; the rest is up to you.'
  }
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO title="FAQ — FullyFundedHub" description="Answers to common questions about FullyFundedHub: how we verify listings, how to submit opportunities, and more." />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Support</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold mt-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Everything you need to know about using FullyFundedHub to find verified scholarships and internships.</p>
      </motion.div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-semibold text-foreground">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12 glass-card rounded-2xl p-8">
        <p className="text-muted-foreground">Still have questions?</p>
        <Link to="/contact" className="inline-block mt-3 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
          Contact us
        </Link>
      </div>
    </div>
  );
}
