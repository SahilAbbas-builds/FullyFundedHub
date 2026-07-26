import { Clock } from 'lucide-react';

export function getDaysUntil(deadline) {
  if (!deadline) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

export function getDeadlineStatus(deadline) {
  const days = getDaysUntil(deadline);
  if (days === null) return { label: 'Open', tone: 'neutral' };
  if (days < 0) return { label: 'Expired', tone: 'expired' };
  if (days === 0) return { label: 'Today', tone: 'urgent' };
  if (days <= 7) return { label: `${days} day${days === 1 ? '' : 's'} left`, tone: 'urgent' };
  if (days <= 30) return { label: `${days} days left`, tone: 'approaching' };
  return { label: `${days} days left`, tone: 'plenty' };
}

const toneStyles = {
  urgent: 'bg-destructive/15 text-red-400 border-destructive/30',
  approaching: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  plenty: 'bg-accent/15 text-emerald-400 border-accent/30',
  expired: 'bg-muted text-muted-foreground border-border',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export default function CountdownBadge({ deadline, deadlineNote, className = '' }) {
  if (!deadline && deadlineNote) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${toneStyles.neutral} ${className}`}>
        <Clock className="w-3 h-3" />
        {deadlineNote}
      </span>
    );
  }
  const status = getDeadlineStatus(deadline);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${toneStyles[status.tone]} ${className}`}>
      <Clock className="w-3 h-3" />
      {status.label}
    </span>
  );
}


