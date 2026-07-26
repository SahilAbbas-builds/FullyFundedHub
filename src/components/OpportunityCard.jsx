import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, GraduationCap } from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';
import SaveButton from '@/components/SaveButton';

export default function OpportunityCard({ opportunity }) {
  const flagUrl = opportunity.country_code
    ? `https://flagcdn.com/w40/${opportunity.country_code.toLowerCase()}.png`
    : null;

  const isScholarship = opportunity.opportunity_type === 'Scholarship';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/opportunities/${opportunity.id}`}
        className={`group relative glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-white/5 ${
          isScholarship
            ? 'hover:shadow-primary/20 hover:border-primary/30'
            : 'hover:shadow-accent/20 hover:border-accent/30'
        }`}
      >
        {/* top hairline glow */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300 ${
            isScholarship
              ? 'bg-gradient-to-r from-transparent via-primary to-transparent'
              : 'bg-gradient-to-r from-transparent via-accent to-transparent'
          }`}
        />

        {/* ambient corner glow, only visible on hover */}
        <div
          className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${
            isScholarship ? 'bg-primary' : 'bg-accent'
          }`}
        />

        <div
          className={`relative h-20 flex items-center justify-center overflow-hidden ${
            isScholarship
              ? 'bg-gradient-to-br from-primary/15 via-primary/5 to-transparent'
              : 'bg-gradient-to-br from-accent/15 via-accent/5 to-transparent'
          }`}
        >
          {/* soft radial glow behind icon */}
          <div
            className={`absolute w-16 h-16 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 ${
              isScholarship ? 'bg-primary' : 'bg-accent'
            }`}
          />
          {isScholarship ? (
            <GraduationCap className="relative w-10 h-10 text-primary/40 group-hover:text-primary/60 group-hover:scale-110 transition-all duration-300" />
          ) : (
            <Building2 className="relative w-10 h-10 text-accent/40 group-hover:text-accent/60 group-hover:scale-110 transition-all duration-300" />
          )}
        </div>

        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isScholarship
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-accent/15 text-accent border-accent/30'
              }`}>
                {opportunity.opportunity_type}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                opportunity.funding_type === 'Full'
                  ? 'bg-accent/10 text-accent border-accent/25'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {opportunity.funding_type} Funding
              </span>
            </div>
            <SaveButton opportunityId={opportunity.id} />
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {opportunity.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {opportunity.organization || 'Various organizations'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {flagUrl && (
              <span className="flex items-center gap-1.5">
                <img src={flagUrl} alt={opportunity.country} className="w-5 h-3.5 rounded-sm object-cover" />
                {opportunity.country}
              </span>
            )}
            {opportunity.degree_level && (
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                {opportunity.degree_level}
              </span>
            )}
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between">
            <CountdownBadge deadline={opportunity.deadline} deadlineNote={opportunity.deadline_note} />
            {opportunity.field_of_study && (
              <span className="text-xs text-muted-foreground truncate max-w-[50%]">{opportunity.field_of_study}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

