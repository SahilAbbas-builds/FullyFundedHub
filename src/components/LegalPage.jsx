import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { ShieldCheck } from 'lucide-react';

export default function LegalPage({ title, description, children }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO title={`${title} — FullyFundedHub`} description={description} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Legal</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-8">{title}</h1>
        <div className="prose-legal">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
