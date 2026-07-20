import { Link } from 'react-router-dom';
import { MapPin, Building2, GraduationCap, Wallet } from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';
import SaveButton from '@/components/SaveButton';

export default function OpportunityCard({ opportunity }) {
  const flagUrl = opportunity.country_code
    ? `https://flagcdn.com/w40/${opportunity.country_code.toLowerCase()}.png`
    : null;

  return (
    <Link
      to={`/opportunities/${opportunity.id}`}
      className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
              opportunity.opportunity_type === 'Scholarship'
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
          <CountdownBadge deadline={opportunity.deadline} />
          {opportunity.field_of_study && (
            <span className="text-xs text-muted-foreground truncate max-w-[50%]">{opportunity.field_of_study}</span>
          )}
        </div>
      </div>
    </Link>
  );
}